import IPFS from 'ipfs'
import webRtcUtils from './utils/webrtc'
import PeerId from 'peer-id'
import delay from 'delay'

export class Sav3Ipfs {
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
          Swarm: ['/dns4/starservertest.sav3.org/tcp/443/wss/p2p-webrtc-star/']
        }
      }
    }

    const ipfs = await IPFS.create(ipfsOptions)
    this.ipfs = webRtcUtils.withWebRtcSdpCache(ipfs)

    // add to window for testing and debugging in console
    window.ipfs = this.ipfs
    window.sav3Ipfs = this

    // everything below is debug test stuff
    setInterval(async () => {
      const stat = await this.ipfs.bitswap.stat()
      let statString = ''
      for (const i in stat) {
        statString += `${i} ${stat[i].toString()} `
      }
      console.log(statString)
    }, 30000)

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
    await this._waitForReady()

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

  /**
   * ipfs has finished initializing and its methods are ready to use
   *
   * @returns {boolean}
   */
  isReady () {
    return !!this.ipfs
  }

  async _waitForReady () {
    if (this.ipfs) {
      return
    }
    await delay(10)
    await this._waitForReady()
  }
}

// export a singleton to be used throughout the app
export default new Sav3Ipfs()
