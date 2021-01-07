import Ipfs from 'ipfs'
import webRtcUtils from './utils/webrtc'
import bitswapUtils from './utils/bitswap'
import PeerId from 'peer-id'
import delay from 'delay'
import assert from 'assert'
import IpnsClient from './ipns-client'
import EventEmitter from 'events'
import ipns from 'ipns'
import crypto from 'libp2p-crypto'
import createWindowSav3IpfsTestMethods from './utils/create-window-sav3-ipfs-test-methods'
import uint8ArrayToString from 'uint8arrays/to-string'
import config from 'src/config'
import postRepliesUtils from './utils/post-replies'

class Sav3Ipfs extends EventEmitter {
  constructor () {
    super()
    this.ipfs = null
    this.ipnsClient = null
    this._initIpfs().catch(console.log)
  }

  async _initIpfs ({privateKey} = {}) {
    const ipfsOptions = {
      preload: {enabled: false},
      config: {
        Bootstrap: [],
        Addresses: {
          Delegates: [],
          Swarm: config.starServers
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

    // a random repo allows multiple tabs to have different peers
    // which is good for testing
    if (!privateKey && process.env.NODE_ENV === 'development') {
      ipfsOptions.repo = Math.random().toString(36).substring(7)
    }

    // init ipfs with a specified private key
    if (privateKey) {
      ipfsOptions.config.Identity = {PrivKey: privateKey}
    }

    console.log('_initIpfs', {ipfsOptions})

    const ipfs = await Ipfs.create(ipfsOptions)
    this.ipfs = webRtcUtils.withWebRtcSdpCache(ipfs)
    this.ipfs = bitswapUtils.withBlockReceivedPeerCidCache(ipfs)

    // init ipns client
    this.ipnsClient = IpnsClient({ipfs})
    // subscribe to new publishes
    this.ipnsClient.on('publish', (ipnsPath, ipnsValue) => {
      this.emit('publish', ipnsPath, ipnsValue)
    })

    // add to window for testing and debugging in console
    window.ipfs = this.ipfs

    this.ipfs.libp2p.on('peer:discovery', (peer) => {
      console.log('discovered', peer)
    })

    this.ipfs.libp2p.on('peer:connect', (peer) => {
      console.log('connected', peer)
      this.ipfs.swarm.peers().then((peers) => console.log('current peers connected: ', peers))
    })

    // silence listener memory leak warning
    this.setMaxListeners(100)
  }

  /**
   * get information and stats about all connected peers
   *
   * @returns {Promise<{peerCid: string, ip: string | undefined, port: number | undefined, protocol: string | undefined, dataReceived: number, dataSent: number}>}
   */
  async getPeersStats () {
    await this.waitForReady()

    const peersStats = []
    const peerCids = await this.getPeersCids()
    for (const peerCid of peerCids) {
      peersStats.push(await this.getPeerStats(peerCid))
    }
    console.log('getPeersStats', {peersStats})
    return peersStats
  }

  async getPeerStats (peerCid) {
    await this.waitForReady()
    assert(typeof peerCid === 'string', `sav3Ipfs.getPeerStats peerId '${peerCid}' not a string`)

    const metrics = this.ipfs.libp2p.metrics

    let ip, port, protocol
    try {
      const connectionInfo = await webRtcUtils.getWebRtcPeerConnectionInfo(peerCid)
      ip = connectionInfo.ip
      port = connectionInfo.port
      protocol = connectionInfo.protocol
    }
    catch (e) {}

    const peerMetrics = metrics.forPeer(PeerId.createFromCID(peerCid)).toJSON()
    const dataReceived = Number(peerMetrics.dataReceived)
    const dataSent = Number(peerMetrics.dataSent)

    const peerStats = {peerCid, ip, port, protocol, dataReceived, dataSent}
    return peerStats
  }

  async getPeersCids () {
    await this.waitForReady()
    const peers = await this.ipfs.swarm.peers()
    const peerCidsSet = new Set()
    const peerCids = []
    for (const peer of peers) {
      const peerCid = peer.peer
      // finds duplicate peers sometimes for unknown reason
      if (peerCidsSet.has(peerCid)) {
        continue
      }
      peerCidsSet.add(peerCid)
      peerCids.push(peerCid)
    }
    return peerCids
  }

  async getPrivateKey () {
    await this.waitForReady()
    const encryptedPrivateKeyString = await this.ipfs.key.export('self', 'password')
    const privateKey = await crypto.keys.import(encryptedPrivateKeyString, 'password')
    return uint8ArrayToString(privateKey.bytes, 'base64')
  }

  async setPrivateKey (base64PrivateKey) {
    assert(base64PrivateKey && typeof base64PrivateKey === 'string', `sav3Ipfs.setPrivateKey base64PrivateKey '${base64PrivateKey}' not a string`)
    const ipfs = this.ipfs
    delete this.ipfs
    await ipfs.stop()
    await this._initIpfs({privateKey: base64PrivateKey})
  }

  async getOwnPeerCid () {
    await this.waitForReady()
    return (await sav3Ipfs.ipfs.id()).id
  }

  async getOwnUserCid () {
    await this.waitForReady()
    // currently same as peer cid, but eventually should
    // be different for privacy
    return (await sav3Ipfs.ipfs.id()).id
  }

  async getOwnIpnsRecord () {
    await this.waitForReady()
    const ownCid = await sav3Ipfs.getOwnPeerCid()
    const peerId = PeerId.createFromCID(ownCid)
    const datastoreValue = await this.ipfs.libp2p.datastore.get(ipns.getLocalKey(peerId.id))
    const ipnsRecord = ipns.unmarshal(datastoreValue)
    return ipnsRecord
  }

  async putOwnIpnsRecord ({value, sequence} = {}) {
    await this.waitForReady()
    assert(value && typeof value === 'string', `sav3Ipfs.putOwnIpnsRecord value '${value}' not a string`)
    assert(typeof sequence === 'number', `sav3Ipfs.putOwnIpnsRecord sequence '${sequence}' not a number`)

    // needs /ipfs/ prefix to ipfs.name.resolve correctly
    if (!value.startsWith('/ipfs/')) {
      value = `/ipfs/${value}`
    }

    const validity = 1000 * 60 * 60 * 24 * 365 * 10 // 10 years
    const encryptedPrivateKeyString = await this.ipfs.key.export('self', 'password')
    const privateKey = await crypto.keys.import(encryptedPrivateKeyString, 'password')
    const ipnsRecord = await ipns.create(privateKey, value, sequence, validity)
    const marshalledIpnsRecord = ipns.marshal(ipnsRecord)

    const ownCid = await sav3Ipfs.getOwnPeerCid()
    const peerId = PeerId.createFromCID(ownCid)
    await this.ipfs.libp2p.datastore.put(ipns.getLocalKey(peerId.id), marshalledIpnsRecord)

    // resolve name right away or won't be available right away putting it
    await this.ipfs.name.resolve(ownCid)
    return ipnsRecord
  }

  async getIpfsFile (fileCid) {
    await this.waitForReady()
    assert(fileCid && typeof fileCid === 'string', `sav3Ipfs.getIpfsFile fileCid '${fileCid}' not a string`)
    const file = (await this.ipfs.get(fileCid).next()).value
    let content
    if (file.content) {
      const res = await file.content.next()
      content = res && res.value && res.value.toString()
    }
    console.log('getIpfsFile', {fileCid, file, content})
    return content
  }

  async getOwnIpnsData () {
    await this.waitForReady()
    const record = await this.getOwnIpnsRecord()
    const ownIpfsValue = record.value.toString()
    const lastIpnsData = await this.getIpfsFile(ownIpfsValue)
    console.log('getOwnIpnsData', {ownIpfsValue, lastIpnsData})
    if (!lastIpnsData) {
      return {}
    }
    return JSON.parse(lastIpnsData)
  }

  async subscribeToIpnsPath (ipnsPath) {
    assert(ipnsPath && typeof ipnsPath === 'string', `sav3Ipfs.subscribeToIpnsPath ipnsPath '${ipnsPath}' not a string`)
    await this.waitForReady()
    const ipnsValues = await this.ipnsClient.subscribe([ipnsPath])
    return ipnsValues[0]
  }

  async subscribeToIpnsPaths (ipnsPaths) {
    assert(Array.isArray(ipnsPaths), `sav3Ipfs.subscribeToIpnsPaths ipnsPaths '${ipnsPaths}' not an array`)
    await this.waitForReady()
    const ipnsValues = await this.ipnsClient.subscribe(ipnsPaths)
    return ipnsValues
  }

  async publishPost ({content, parentPostCid} = {}) {
    await this.waitForReady()
    assert(content && typeof content === 'string', `sav3Ipfs.publishPost content '${content}' not a string`)
    assert(content.length <= 140, `sav3Ipfs.publishPost content '${content}' longer than 140 chars`)
    assert(!parentPostCid || typeof parentPostCid === 'string', `sav3Ipfs.publishPost parentPostCid '${parentPostCid}' not a string`)

    const ipnsData = await this.getOwnIpnsData()
    const newPost = {}
    newPost.previousPostCid = ipnsData.lastPostCid
    newPost.timestamp = Math.round(Date.now() / 1000)
    newPost.userCid = (await this.ipfs.id()).id
    newPost.contentCid = (await this.ipfs.add(content)).cid.toString()

    const newPostCid = (await this.ipfs.add(JSON.stringify(newPost))).cid.toString()
    const newIpnsData = {...ipnsData, lastPostCid: newPostCid}
    const newIpnsDataCid = (await this.ipfs.add(JSON.stringify(newIpnsData))).cid.toString()

    await this.publishIpnsRecord(newIpnsDataCid)
    console.log('publishPost', {newIpnsDataCid, newPost, newIpnsData, ipnsData, newPostCid, parentPostCid})

    if (parentPostCid) {
      await postRepliesUtils.cachePostReplyCid({cid: newPostCid, parentPostCid})
    }

    return newPostCid
  }

  async setFollowing (userCids) {
    await this.waitForReady()
    assert(Array.isArray(userCids), `sav3Ipfs.setFollowing userCids '${userCids}' not an array`)

    // sort to avoid creating cids if unnecessary
    userCids = [...userCids].sort()

    const ipnsData = await this.getOwnIpnsData()
    const followingCid = (await this.ipfs.add(JSON.stringify(userCids))).cid.toString()
    if (ipnsData.followingCid === followingCid) {
      console.log('setFollowing duplicate following cid', {userCids})
      return
    }
    const newIpnsData = {...ipnsData, followingCid}
    const newIpnsDataCid = (await this.ipfs.add(JSON.stringify(newIpnsData))).cid.toString()

    await this.publishIpnsRecord(newIpnsDataCid)
    console.log('setFollowing', {newIpnsDataCid, userCids, followingCid, newIpnsData, ipnsData})

    return followingCid
  }

  async getUserFollowing (userCid) {
    await this.waitForReady()
    assert(userCid && typeof userCid === 'string', `sav3Ipfs.getUserFollowing userCid '${userCid}' not a string`)
    let following = []

    const [ipnsValue] = await this.ipnsClient.subscribe([userCid])
    if (ipnsValue) {
      const ipnsData = JSON.parse(await this.getIpfsFile(ipnsValue))
      if (ipnsData.followingCid) {
        following = JSON.parse(await this.getIpfsFile(ipnsData.followingCid))
      }
    }

    console.log('getUserFollowing', {userCid, following, ipnsValue})
    return following
  }

  async publishIpnsRecord (newIpnsDataCid) {
    await this.waitForReady()
    assert(typeof newIpnsDataCid === 'string', `sav3Ipfs.publishIpnsRecord '${newIpnsDataCid}' not a string`)
    // use the ipns server until ipfs.name.publish is implemented in browser
    const sequence = (await this.getOwnIpnsRecordSequence()) + 1
    await this.ipnsClient.publish({value: newIpnsDataCid, sequence})
    await this.putOwnIpnsRecord({value: newIpnsDataCid, sequence})
    console.log('publishIpnsRecord', {newIpnsDataCid, sequence})
  }

  async editUserProfile ({displayName, description, thumbnailUrl, bannerUrl} = {}) {
    await this.waitForReady()
    const profile = {}

    if (displayName) {
      assert(typeof displayName === 'string', 'display name not a string')
      assert(displayName.length <= 50, `display name '${displayName}' longer than 50 chars`)
      profile.diplayNameCid = (await this.ipfs.add(displayName)).cid.toString()
    }
    if (description) {
      assert(typeof description === 'string', 'description not a string')
      assert(description.length <= 140, `description '${description}' longer than 140 chars`)
      profile.descriptionCid = (await this.ipfs.add(description)).cid.toString()
    }
    if (thumbnailUrl) {
      assert(typeof thumbnailUrl === 'string', 'thumbnail url not a string')
      assert(thumbnailUrl.startsWith('https://'), `thumbnail url '${thumbnailUrl}' does not start with https://`)
      assert(thumbnailUrl.length <= 140, `thumbnail url '${thumbnailUrl}' longer than 140 chars`)
      profile.thumbnailUrlCid = (await this.ipfs.add(thumbnailUrl)).cid.toString()
    }
    if (bannerUrl) {
      assert(typeof bannerUrl === 'string', 'banner url not a string')
      assert(bannerUrl.startsWith('https://'), `banner url '${bannerUrl}' does not start with https://`)
      assert(bannerUrl.length <= 140, `banner url '${thumbnailUrl}' longer than 140 chars`)
      profile.bannerUrlCid = (await this.ipfs.add(bannerUrl)).cid.toString()
    }

    const profileCid = (await this.ipfs.add(JSON.stringify(profile))).cid.toString()

    const ipnsData = await this.getOwnIpnsData()
    ipnsData.profileCid = profileCid
    const newIpnsDataCid = (await this.ipfs.add(JSON.stringify(ipnsData))).cid.toString()
    await this.publishIpnsRecord(newIpnsDataCid)
    console.log('editProfile', {displayName, description, thumbnailUrl, bannerUrl, ipnsData, profile, profileCid, newIpnsDataCid})

    return profileCid
  }

  async getUserProfile (profileCid) {
    await this.waitForReady()
    assert(typeof profileCid === 'string', `sav3Ipfs.getUserProfile profileCid '${profileCid}' not a string`)
    const profileCids = JSON.parse(await this.getIpfsFile(profileCid))
    const profile = {}
    if (profileCids.diplayNameCid) {
      profile.displayName = await this.getIpfsFile(profileCids.diplayNameCid)
    }
    if (profileCids.descriptionCid) {
      profile.description = await this.getIpfsFile(profileCids.descriptionCid)
    }
    if (profileCids.thumbnailUrlCid) {
      profile.thumbnailUrl = await this.getIpfsFile(profileCids.thumbnailUrlCid)
    }
    if (profileCids.bannerUrlCid) {
      profile.bannerUrl = await this.getIpfsFile(profileCids.bannerUrlCid)
    }

    console.log('getUserProfile', {profileCid, profileCids, profile})
    return profile
  }

  async getOwnIpnsRecordSequence () {
    await this.waitForReady()
    const ipnsRecord = await this.getOwnIpnsRecord()
    const sequence = ipnsRecord
    const ownCid = await sav3Ipfs.getOwnPeerCid()
    const [remoteIpnsRecord] = await this.ipnsClient.getRecords([ownCid])
    const remoteSequence = (remoteIpnsRecord && remoteIpnsRecord.sequence) || 0
    if (sequence > remoteSequence) {
      return sequence
    }
    else {
      return remoteSequence
    }
  }

  async getUserPostsFromLastPostCid (lastPostCid) {
    await this.waitForReady()
    assert(lastPostCid && typeof lastPostCid === 'string', `sav3Ipfs.getUserPostsFromLastPostCid lastPostCid '${lastPostCid}' not a string`)
    const posts = []

    const maxPostCount = 5

    while (true) {
      // no more last post id so reached the first post by that user
      if (!lastPostCid) {
        break
      }
      if (posts.length >= maxPostCount) {
        break
      }

      const post = await this.getPost(lastPostCid)
      lastPostCid = post.previousPostCid
      posts.push(post)
    }

    console.log('getUserPostsFromLastPostCid', {lastPostCid, posts})
    return posts
  }

  async getPost (postCid) {
    await this.waitForReady()
    assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPost postCid '${postCid}' not a string`)
    console.log('getPost', {postCid})

    const post = JSON.parse(await this.getIpfsFile(postCid))
    post.cid = postCid

    if (post.parentPostCid) {
      await postRepliesUtils.cachePostReplyCid({cid: post.cid, parentPostCid: post.parentPostCid})
    }

    post.content = await this.getIpfsFile(post.contentCid)
    console.log('getPost returns', {postCid, post})
    return post
  }

  async getPostRepliesCids (postCid) {
    await this.waitForReady()
    assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostRepliesCids postCid '${postCid}' not a string`)
    const repliesCids = await postRepliesUtils.getPostRepliesCids(postCid)
    return repliesCids
  }

  async getPostReplyCount (postCid) {
    await this.waitForReady()
    assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostReplyCount postCid '${postCid}' not a string`)
    const repliesCids = await postRepliesUtils.getPostRepliesCids(postCid)
    return repliesCids.length
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

const sav3Ipfs = new Sav3Ipfs()

// for testing
window.sav3Ipfs = sav3Ipfs
window.Ipfs = Ipfs
createWindowSav3IpfsTestMethods(sav3Ipfs)

// export a singleton to be used throughout the app
export default sav3Ipfs
