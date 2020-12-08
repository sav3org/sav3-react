import Ipfs from 'ipfs'
import webRtcUtils from './utils/webrtc'
import PeerId from 'peer-id'
import delay from 'delay'
import assert from 'assert'
import IpnsClient from './ipns-client'

class Sav3Ipfs {
  constructor () {
    this._initIpfs()
  }

  async _initIpfs () {
    const ipfsOptions = {
      preload: {enabled: false},
      // a random repo allows multiple tabs to have different peers
      // which id good for testing
      repo: Math.random().toString(36).substring(7),
      config: {
        Bootstrap: [],
        Addresses: {
          Swarm: ['/dns4/star.sav3.org/tcp/443/wss/p2p-webrtc-star/']
        }
      }
      // libp2p: {
      //   config: {
      //     dht: {
      //       enabled: true
      //     }
      //   }
      // }
    }

    const ipfs = await Ipfs.create(ipfsOptions)
    this.ipfs = webRtcUtils.withWebRtcSdpCache(ipfs)

    // add to window for testing and debugging in console
    window.ipfs = this.ipfs

    // everything below is debug test stuff
    // setInterval(async () => {
    //   const stat = await this.ipfs.bitswap.stat()
    //   let statString = ''
    //   for (const i in stat) {
    //     statString += `${i} ${stat[i].toString()} `
    //   }
    //   console.log(statString)
    // }, 30000)

    this.ipfs.libp2p.on('peer:discovery', (peer) => {
      console.log('discovered', peer)
    })

    this.ipfs.libp2p.on('peer:connect', (peer) => {
      console.log('connected', peer)

      this.ipfs.swarm.peers().then((peers) => console.log('current peers connected: ', peers))
    })

    window.testAdd = async () => {
      const data = {
        content: 'hello world ' + Math.random()
      }
      const res = await this.ipfs.add(data)
      console.log(res)
      // for await (const res of ipfs.add(data)) {
      //   console.log(res)
      // }
    }

    window.testGet = async (cid) => {
      for await (const file of this.ipfs.get(cid)) {
        console.log(file.path)

        if (!file.content) continue

        const content = []

        for await (const chunk of file.content) {
          content.push(chunk)
        }

        console.log(content.toString())
      }
    }

    window.addresses = async () => {
      const res = await this.ipfs.swarm.addrs()
      for (const i in res) {
        for (const addr of res[i].addrs) {
          addr.string = addr.toString()
        }
      }
      console.log(res)
    }

    window.peers = async () => {
      const res = await this.ipfs.swarm.peers()
      for (const peer of res) {
        peer.addrString = peer.addr.toString()
      }
      console.log(res)
    }
  }

  /**
   * get information and stats about all connected peers
   *
   * @returns {Promise<{peerCid: string, ip: string | undefined, port: number | undefined, protocol: string | undefined, dataReceived: number, dataSent: number}>}
   */
  async getPeersStats () {
    await this.waitForReady()

    const metrics = this.ipfs.libp2p.metrics
    const peers = await this.ipfs.swarm.peers()
    const peersStats = []
    const peerCids = new Set()
    for (const peer of peers) {
      const peerCid = peer.peer

      // finds duplicate peers sometimes for unknown reason
      if (peerCids.has(peerCid)) {
        continue
      }
      peerCids.add(peerCid)

      let ip, port, protocol
      try {
        const connectionInfo = webRtcUtils.getWebRtcPeerConnectionInfo(peerCid)
        ip = connectionInfo.ip
        port = connectionInfo.port
        protocol = connectionInfo.protocol
      }
      catch (e) {}

      const peerMetrics = metrics.forPeer(PeerId.createFromCID(peerCid)).toJSON()
      const dataReceived = Number(peerMetrics.dataReceived)
      const dataSent = Number(peerMetrics.dataSent)

      const peerStats = {peerCid, ip, port, protocol, dataReceived, dataSent}
      peersStats.push(peerStats)
    }
    console.log(peersStats)
    return peersStats
  }

  async getIpnsFile (ipnsCid) {
    assert(ipnsCid && typeof ipnsCid === 'string')
    const fileCid = (await this.ipfs.name.resolve(ipnsCid).next()).value
    const file = await this.getIpfsFile(fileCid)
    return file
  }

  async getIpfsFile (fileCid) {
    assert(fileCid && typeof fileCid === 'string')
    const file = (await this.ipfs.get(fileCid).next()).value
    let content
    if (file.content) {
      content = (await file.content.next()).value.toString()
    }
    console.log('getIpfsFile', {fileCid, file, content})
    return content
  }

  async getOwnIpnsData () {
    const ownIpnsCid = (await this.ipfs.id()).id
    const lastIpnsData = await this.getIpnsFile(ownIpnsCid)
    console.log('getOwnIpnsData', {ownIpnsCid, lastIpnsData})
    if (!lastIpnsData) {
      return {}
    }
    return JSON.parse(lastIpnsData)
  }

  async publishPost ({content, parentPostCid} = {}) {
    assert(content && typeof content === 'string')
    assert(content.length <= 140)
    assert(!parentPostCid || typeof parentPostCid === 'string')

    const ipnsData = await this.getOwnIpnsData()
    const newPost = {}
    newPost.previousPostCid = ipnsData.lastPostCid
    newPost.timestamp = Math.round(Date.now() / 1000)
    newPost.publisherCid = (await this.ipfs.id()).id
    newPost.contentCid = (await this.ipfs.add(content)).cid.toString()

    const newPostCid = (await this.ipfs.add(JSON.stringify(newPost))).cid.toString()
    const newIpnsData = {lastPostCid: newPostCid}
    const newIpnsDataCid = (await this.ipfs.add(JSON.stringify(newIpnsData))).cid.toString()
    const publishRes = await this.ipfs.name.publish(newIpnsDataCid)

    console.log('publishPost', {publishRes, newIpnsDataCid, newPost, newIpnsData, ipnsData, newPostCid})
    return newPostCid
  }

  async getOwnUserPosts () {
    const ownIpnsCid = (await this.ipfs.id()).id
    return this.getUserPosts(ownIpnsCid)
  }

  async getUserPosts (userIpnsCid) {
    assert(userIpnsCid && typeof userIpnsCid === 'string')
    const posts = []

    const maxPostCount = 5

    let lastPostCid, ipnsData
    try {
      ipnsData = await this.getIpnsFile(userIpnsCid)
      ipnsData = JSON.parse(ipnsData)
      lastPostCid = ipnsData.lastPostCid
    }
    catch (e) {}

    while (true) {
      // no more last post id so reached the first post by that user
      if (!lastPostCid) {
        break
      }
      if (posts.length >= maxPostCount) {
        break
      }

      const post = JSON.parse(await this.getIpfsFile(lastPostCid))
      lastPostCid = post.previousPostCid

      post.content = await this.getIpfsFile(post.contentCid)
      posts.push(post)
    }

    console.log('getUserPosts', {userIpnsCid, ipnsData, lastPostCid, posts})
    return posts
  }

  /**
   * ipfs has finished initializing and its methods are ready to use
   *
   * @returns {boolean}
   */
  isReady () {
    return !!this.ipfs
  }

  async waitForReady () {
    if (this.ipfs) {
      return
    }
    await delay(10)
    await this.waitForReady()
  }
}

export const sav3Ipfs = new Sav3Ipfs()

// useful for testing
window.sav3Ipfs = sav3Ipfs
window.Ipfs = Ipfs

// export a singleton to be used throughout the app
export default sav3Ipfs
