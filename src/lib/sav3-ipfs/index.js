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
import serialize from './utils/serialize'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:index')

class Sav3Ipfs extends EventEmitter {
  constructor () {
    super()
    this.ipfs = null
    this.ipnsClient = null
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
    debug('getPeersStats', {peersStats})
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

  async publishPost ({content, parentPostCid, quotedPostCid} = {}) {
    await this.waitForReady()
    assert(content && typeof content === 'string', `sav3Ipfs.publishPost content '${content}' not a string`)
    assert(content.length <= 140, `sav3Ipfs.publishPost content '${content}' longer than 140 chars`)
    assert(!parentPostCid || typeof parentPostCid === 'string', `sav3Ipfs.publishPost parentPostCid '${parentPostCid}' not a string`)
    assert(!quotedPostCid || typeof quotedPostCid === 'string', `sav3Ipfs.publishPost quotedPostCid '${quotedPostCid}' not a string`)
    assert(Boolean(parentPostCid && quotedPostCid) === false, `sav3Ipfs.publishPost cannot have both parentPostCid '${parentPostCid}' and quotedPostCid '${quotedPostCid}'`)

    const ipnsContent = await this.getOwnUserIpnsContent()
    const newPost = {}
    newPost.quotedPostCid = quotedPostCid
    newPost.parentPostCid = parentPostCid
    newPost.previousPostCid = ipnsContent.lastPostCid
    newPost.timestamp = Math.round(Date.now() / 1000)
    newPost.userCid = (await this.ipfs.id()).id
    newPost.contentCid = (await this.ipfs.add(content)).cid.toString()

    const newPostCid = (await this.ipfs.add(serialize.serializePost(newPost))).cid.toString()
    const newIpnsContent = {...ipnsContent, lastPostCid: newPostCid}
    const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(newIpnsContent))).cid.toString()

    await this.publishIpnsRecord(newIpnsContentCid)
    debug('publishPost', {newIpnsContentCid, newPost, newIpnsContent, ipnsContent, newPostCid, parentPostCid})

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

    const ipnsContent = await this.getOwnUserIpnsContent()
    const followingCid = (await this.ipfs.add(JSON.stringify(userCids))).cid.toString()
    if (ipnsContent.followingCid === followingCid) {
      debug('setFollowing duplicate following cid', {userCids})
      return
    }
    const newIpnsContent = {...ipnsContent, followingCid}
    const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(newIpnsContent))).cid.toString()

    await this.publishIpnsRecord(newIpnsContentCid)
    debug('setFollowing', {newIpnsContentCid, userCids, followingCid, newIpnsContent, ipnsContent})

    return followingCid
  }

  async getUserFollowing (userCid) {
    await this.waitForReady()
    assert(userCid && typeof userCid === 'string', `sav3Ipfs.getUserFollowing userCid '${userCid}' not a string`)
    let following = []

    const [ipnsValue] = await this.ipnsClient.subscribe([userCid])
    if (ipnsValue) {
      const ipnsContent = await this.getUserIpnsContent(ipnsValue)
      if (ipnsContent.followingCid) {
        following = JSON.parse(await this.getIpfsContent(ipnsContent.followingCid))
      }
    }

    debug('getUserFollowing', {userCid, following, ipnsValue})
    return following
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
      assert(thumbnailUrl.replace(/[#?].*/, '').match(/\.(jpeg|jpg|png|gif|mp4|webm)$/), `thumbnail url '${thumbnailUrl}' does not end with jpeg|jpg|png|gif|mp4|webm`)
      assert(thumbnailUrl.length <= 140, `thumbnail url '${thumbnailUrl}' longer than 140 chars`)
      profile.thumbnailUrlCid = (await this.ipfs.add(thumbnailUrl)).cid.toString()
    }
    if (bannerUrl) {
      assert(typeof bannerUrl === 'string', 'banner url not a string')
      assert(bannerUrl.startsWith('https://'), `banner url '${bannerUrl}' does not start with https://`)
      assert(bannerUrl.replace(/[#?].*/, '').match(/\.(jpeg|jpg|png|gif|mp4|webm)$/), `banner url '${bannerUrl}' does not end with jpeg|jpg|png|gif|mp4|webm`)
      assert(bannerUrl.length <= 140, `banner url '${bannerUrl}' longer than 140 chars`)
      profile.bannerUrlCid = (await this.ipfs.add(bannerUrl)).cid.toString()
    }

    const profileCid = (await this.ipfs.add(serialize.serializeProfile(profile))).cid.toString()

    const ipnsContent = await this.getOwnUserIpnsContent()
    ipnsContent.profileCid = profileCid
    const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(ipnsContent))).cid.toString()
    await this.publishIpnsRecord(newIpnsContentCid)
    debug('editProfile', {displayName, description, thumbnailUrl, bannerUrl, ipnsContent, profile, profileCid, newIpnsContentCid})

    return profileCid
  }

  async getUserProfile (profileCid) {
    await this.waitForReady()
    assert(typeof profileCid === 'string', `sav3Ipfs.getUserProfile profileCid '${profileCid}' not a string`)
    const profileCids = serialize.deserializeProfile(await this.getIpfsContent(profileCid))
    const profile = {}
    if (profileCids.diplayNameCid) {
      profile.displayName = await this.getIpfsContent(profileCids.diplayNameCid)
    }
    if (profileCids.descriptionCid) {
      profile.description = await this.getIpfsContent(profileCids.descriptionCid)
    }
    if (profileCids.thumbnailUrlCid) {
      profile.thumbnailUrl = await this.getIpfsContent(profileCids.thumbnailUrlCid)
    }
    if (profileCids.bannerUrlCid) {
      profile.bannerUrl = await this.getIpfsContent(profileCids.bannerUrlCid)
    }

    debug('getUserProfile', {profileCid, profileCids, profile})
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

  // don't use this anywhere because it's synchronous and slow
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

    debug('getUserPostsFromLastPostCid', {lastPostCid, posts})
    return posts
  }

  async * getPreviousPostCids (lastPostCid) {
    await this.waitForReady()
    assert(lastPostCid && typeof lastPostCid === 'string', `sav3Ipfs.getPostCidsFromLastPostCid lastPostCid '${lastPostCid}' not a string`)

    let previousPostCid = lastPostCid
    let postCount = 0

    // loop over every post and yield
    while (true) {
      postCount++
      yield previousPostCid
      const post = serialize.deserializePost(await this.getIpfsContent(previousPostCid))
      debug('getPreviousPostCids', {lastPostCid, previousPostCid, post, postCount})
      if (!post.previousPostCid) {
        return
      }
      previousPostCid = post.previousPostCid
    }
  }

  async getPost (postCid) {
    await this.waitForReady()
    assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPost postCid '${postCid}' not a string`)
    debug('getPost', {postCid})

    const post = serialize.deserializePost(await this.getIpfsContent(postCid))
    post.cid = postCid

    if (post.parentPostCid) {
      await postRepliesUtils.cachePostReplyCid({cid: post.cid, parentPostCid: post.parentPostCid})
    }

    post.content = await this.getIpfsContent(post.contentCid)
    debug('getPost returns', {postCid, post})
    return post
  }

  async getPostRepliesCids (postCid) {
    await this.waitForReady()
    assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostRepliesCids postCid '${postCid}' not a string`)
    const repliesCids = await postRepliesUtils.getPostRepliesCids(postCid)
    return repliesCids
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
