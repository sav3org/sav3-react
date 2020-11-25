import IPFS from 'ipfs'
import ipfsUtils from './utils'

export class Sav3Ipfs {
  constructor() {
    const ipfsOptions = {
      preload: { enabled: false },
      repo: Math.random().toString(36).substring(7),
      config: {
        Bootstrap: [],
        Addresses: {
          Swarm: ['/dns4/starservertest.sav3.org/tcp/443/wss/p2p-webrtc-star/']
        }
      }
    }

    ;(async () => {
      this.ipfs = await IPFS.create(ipfsOptions)
      this.ipfs = ipfsUtils.withWebRtcSdpCache(this.ipfs)
      window.ipfs = this.ipfs
      window.sav3Ipfs = this

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

      this.ipfs.libp2p.on('peer:connect', async (peer) => {
        console.log('connected', peer)

        this.ipfs.swarm.peers().then(peers => console.log('current peers connected: ', peers))
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

          if (!file.content) continue;

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
    })()
  }

  async getPeersStats() {
    const peers = await this.ipfs.swarm.peers()
    const peersStats = []
    for (const peer of peers) {
      const peerId = peer.peer
      const peerStats = {
        peerId, ...ipfsUtils.getWebRtcPeerConnectionInfo(peerId)
      }
      peersStats.push(peerStats)
      console.log(peerStats)
    }
    return peersStats
    // const metrics = this.ipfs.libp2p.metrics
    // const peerIds = metrics.peers
    // for (const peerId of peerIds) {
    //   console.log(peerId)
    //   console.log(metrics.forPeer(peerId))
    // }
  }
}

// export a singleton to be used throughout the app
export default new Sav3Ipfs()
