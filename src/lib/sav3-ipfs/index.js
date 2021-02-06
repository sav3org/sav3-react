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
import serialize from './utils/serialize'
import Debug from 'debug'

// sav3 ipfs api
import postApi from './api/post'
import profileApi from './api/profile'
import followingApi from './api/following'
import statsApi from './api/stats'
const debug = Debug('sav3:sav3-ipfs:sav3-ipfs')

class Sav3Ipfs extends EventEmitter {
  constructor () {
    super()
    this.ipfs = null
    this.ipnsClient = null

    // assign all apis
    for (const method in postApi) {
      this[method] = postApi[method]
    }
    for (const method in profileApi) {
      this[method] = profileApi[method]
    }
    for (const method in followingApi) {
      this[method] = followingApi[method]
    }
    for (const method in statsApi) {
      this[method] = statsApi[method]
    }

    this._initIpfs().catch(console.error)
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

    debug('_initIpfs', {ipfsOptions})

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
      debug('discovered', peer)
    })

    this.ipfs.libp2p.on('peer:connect', (peer) => {
      debug('connected', peer)
      this.ipfs.swarm.peers().then((peers) => debug('current peers connected: ', peers))
    })

    // silence listener memory leak warning
    this.setMaxListeners(100)
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

  async getOwnIpnsRecord () {
    await this.waitForReady()
    const ownCid = await sav3Ipfs.getOwnPeerCid()
    const peerId = PeerId.createFromCID(ownCid)
    const datastoreValue = await this.ipfs.libp2p.datastore.get(ipns.getLocalKey(peerId.id))
    const ipnsRecord = ipns.unmarshal(datastoreValue)
    return ipnsRecord
  }

  async setOwnIpnsRecord ({value, sequence} = {}) {
    await this.waitForReady()
    assert(value && typeof value === 'string', `sav3Ipfs.setOwnIpnsRecord value '${value}' not a string`)
    assert(typeof sequence === 'number', `sav3Ipfs.setOwnIpnsRecord sequence '${sequence}' not a number`)

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

  async getIpfsContent (cid) {
    await this.waitForReady()
    assert(cid && typeof cid === 'string', `sav3Ipfs.getIpfsContent cid '${cid}' not a string`)
    const file = (await this.ipfs.get(cid).next()).value
    let content
    if (file.content) {
      const res = await file.content.next()
      content = res && res.value && res.value.toString()
    }
    debug('getIpfsContent', {cid, file, content})
    return content
  }

  async getUserIpnsContent (userIpnsContentCid) {
    await this.waitForReady()
    assert(userIpnsContentCid && typeof userIpnsContentCid === 'string', `sav3Ipfs.getUserIpnsContent userIpnsContentCid '${userIpnsContentCid}' not a string`)
    return serialize.deserializeUserIpnsContent(await this.getIpfsContent(userIpnsContentCid))
  }

  async getOwnUserIpnsContent () {
    await this.waitForReady()
    const record = await this.getOwnIpnsRecord()
    const ownIpfsValue = record.value.toString()
    const lastIpnsContent = await this.getIpfsContent(ownIpfsValue)
    debug('getOwnUserIpnsContent', {ownIpfsValue, lastIpnsContent})
    if (!lastIpnsContent) {
      return {}
    }
    return serialize.deserializeUserIpnsContent(lastIpnsContent)
  }

  async subscribeToIpnsPath (ipnsPath) {
    assert(ipnsPath && typeof ipnsPath === 'string', `sav3Ipfs.subscribeToIpnsPath ipnsPath '${ipnsPath}' not a string`)
    await this.waitForReady()
    const ipnsValues = await this.ipnsClient.subscribe([ipnsPath])
    return ipnsValues[0]
  }

  async subscribeToIpnsPaths (ipnsPaths) {
    assert(Array.isArray(ipnsPaths), `sav3Ipfs.subscribeToIpnsPaths ipnsPaths '${ipnsPaths}' not an array`)
    for (const ipnsPath of ipnsPaths) {
      assert(ipnsPath && typeof ipnsPath === 'string', `sav3Ipfs.subscribeToIpnsPaths ipnsPaths '${JSON.stringify(ipnsPaths)}' contains non string`)
    }
    await this.waitForReady()
    const ipnsValues = await this.ipnsClient.subscribe(ipnsPaths)
    return ipnsValues
  }

  async publishIpnsRecord (newIpnsContentCid) {
    await this.waitForReady()
    assert(typeof newIpnsContentCid === 'string', `sav3Ipfs.publishIpnsRecord '${newIpnsContentCid}' not a string`)
    // use the ipns server and this.setOwnIpnsRecord until ipfs.name.publish is implemented in browser
    const sequence = (await this.getOwnIpnsRecordSequence()) + 1
    await this.ipnsClient.publish({value: newIpnsContentCid, sequence})
    await this.setOwnIpnsRecord({value: newIpnsContentCid, sequence})
    debug('publishIpnsRecord', {newIpnsContentCid, sequence})
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
