import assert from 'assert'
import WebSocketClient from 'socket.io-client'
import EventEmitter from 'events'
import crypto from 'libp2p-crypto'
import ipns from 'ipns'
import delay from 'delay'
import uint8ArrayToString from 'uint8arrays/to-string'
import PeerId from 'peer-id'
import isIpfs from 'is-ipfs'
import QuickLRU from 'quick-lru'
import config from 'src/config'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:ipns-client')

class IpnsClient extends EventEmitter {
  constructor ({ipfs} = {}) {
    super()
    assert(ipfs && typeof ipfs === 'object')
    this.ipfs = ipfs
    this.privateKey = null
    this.webSocketClient = null
    this.peerCid = null
    this.url = config.ipnsServer
    this.subscriptionIpnsValueCache = new QuickLRU({maxSize: 10000})

    this.start()
  }

  async start () {
    assert(this.webSocketClient === null)
    this.webSocketClient = WebSocketClient(this.url)
    const encryptedPrivateKeyString = await this.ipfs.key.export('self', 'password')
    this.privateKey = await crypto.keys.import(encryptedPrivateKeyString, 'password')
    this.peerCid = (await this.ipfs.id()).id

    // subscribe to new publishes
    this.webSocketClient.on('publish', async (ipnsPath, ipnsRecord) => {
      const ipnsValue = await getIpnsValueFromIpnsRecord(ipnsPath, ipnsRecord)
      this.subscriptionIpnsValueCache.set(ipnsPath, ipnsValue)
      this.emit('publish', ipnsPath, ipnsValue)
    })
  }

  async stop () {
    await this.webSocketClient.close()
    this.webSocketClient = null
  }

  isReady () {
    return this.webSocketClient && this.privateKey
  }

  async waitForReady () {
    if (this.isReady()) {
      return
    }
    await delay(10)
    await this.waitForReady()
  }

  async subscribe (ipnsPaths) {
    validateIpnsPaths(ipnsPaths)
    await this.waitForReady()

    // cache ipns values to call ipnsClient.subscribe
    // multiple times without wasting websocket calls
    let allResultsAreCached = true
    const cachedIpnsValues = []
    for (const ipnsPath of ipnsPaths) {
      const cachedIpnsValue = this.subscriptionIpnsValueCache.get(ipnsPath)
      cachedIpnsValues.push(cachedIpnsValue)
      if (!cachedIpnsValue) {
        allResultsAreCached = false
      }
    }
    // if all values are cached, it must necessarily mean
    // all ipns paths are already subscribed to
    if (allResultsAreCached) {
      debug('subscribe', {allResultsAreCached, ipnsPaths, cachedIpnsValues})
      return cachedIpnsValues
    }

    const ipnsRecords = await new Promise((resolve) => this.webSocketClient.emit('subscribe', ipnsPaths, resolve))
    const ipnsValues = await getIpnsValuesFromIpnsRecords(ipnsPaths, ipnsRecords)

    // cache inital values received from subscribe
    // future values are cached in webSocketClient.on('publish')
    for (const i in ipnsPaths) {
      this.subscriptionIpnsValueCache.set(ipnsPaths[i], ipnsValues[i])
    }

    debug('subscribe', {allResultsAreCached, ipnsPaths, ipnsValues})
    return ipnsValues
  }

  async getRecords (ipnsPaths) {
    validateIpnsPaths(ipnsPaths)
    await this.waitForReady()
    const ipnsRecords = await new Promise((resolve) => this.webSocketClient.emit('resolve', ipnsPaths, resolve))
    const unmarshalled = await getUnmarshalledIpnsRecords(ipnsPaths, ipnsRecords)
    return unmarshalled
  }

  async unsubscribe (ipnsPaths) {
    validateIpnsPaths(ipnsPaths)
    await this.waitForReady()

    // delete values from cache or resubscribing will
    // never get new data
    for (const ipnsPath of ipnsPaths) {
      this.subscriptionIpnsValueCache.delete(ipnsPath)
    }
    await this.webSocketClient.emit('unsubscribe', ipnsPaths)
  }

  async publish ({value, sequence} = {}) {
    assert(typeof value === 'string')
    assert(typeof sequence === 'number')
    await this.waitForReady()

    // needs /ipfs/ prefix to ipfs.name.resolve correctly
    if (!value.startsWith('/ipfs/')) {
      value = `/ipfs/${value}`
    }

    const validity = 1000 * 60 * 60 * 24 * 365 * 10 // 10 years

    const record = await ipns.create(this.privateKey, value, sequence, validity)
    await ipns.embedPublicKey(this.privateKey.public, record) // required to verify marshalled record
    const marshalledRecord = Buffer.from(ipns.marshal(record))

    const ipnsPath = this.peerCid
    await this.webSocketClient.emit('publish', ipnsPath, marshalledRecord)
  }
}

const validateIpnsPaths = (ipnsPaths) => {
  assert(Array.isArray(ipnsPaths), `ipns paths '${JSON.stringify(ipnsPaths)}' not an array`)
  for (const ipnsPath of ipnsPaths) {
    assert(typeof ipnsPath === 'string', `ipns paths '${JSON.stringify(ipnsPaths)}' contains non string '${ipnsPath}'`)
  }
}

const getIpnsValuesFromIpnsRecords = async (ipnsPaths, ipnsRecords) => {
  assert(Array.isArray(ipnsPaths))
  assert(Array.isArray(ipnsRecords))

  const ipnsValues = []

  for (const i in ipnsPaths) {
    // possible to receive null from ipns server if record is not set
    if (ipnsRecords[i] === null) {
      ipnsValues.push(null)
      continue
    }
    ipnsValues.push(await getIpnsValueFromIpnsRecord(ipnsPaths[i], ipnsRecords[i]))
  }

  return ipnsValues
}

const getIpnsValueFromIpnsRecord = async (ipnsPath, marshalledIpnsRecord) => {
  assert(typeof ipnsPath === 'string')
  marshalledIpnsRecord = new Uint8Array(marshalledIpnsRecord)

  // validate ipns record is signed by embedded public key
  const ipnsRecord = ipns.unmarshal(marshalledIpnsRecord)
  const publicKey = ipns.extractPublicKey({}, ipnsRecord)
  await ipns.validate(publicKey, ipnsRecord)

  // validate ipns path is the embedded public key
  // in case malicious user tries to submit old ipns record
  const peerCid = await PeerId.createFromPubKey(publicKey.bytes)
  assert(peerCid.equals(PeerId.createFromB58String(ipnsPath)))

  const ipnsValue = uint8ArrayToString(ipnsRecord.value)
  // validate value is a valid cid and nothing weird
  assert(isIpfs.cid(ipnsValue.replace(/^\/ipfs\//, '')))
  return ipnsValue
}

const getUnmarshalledIpnsRecords = async (ipnsPaths, ipnsRecords) => {
  assert(Array.isArray(ipnsPaths))
  assert(Array.isArray(ipnsRecords))

  const unmarshalled = []

  for (const i in ipnsPaths) {
    // possible to receive null from ipns server if record is not set
    if (ipnsRecords[i] === null) {
      unmarshalled.push(null)
      continue
    }
    unmarshalled.push(await getUnmarshalledIpnsRecord(ipnsPaths[i], ipnsRecords[i]))
  }

  return unmarshalled
}

const getUnmarshalledIpnsRecord = async (ipnsPath, marshalledIpnsRecord) => {
  assert(typeof ipnsPath === 'string')
  marshalledIpnsRecord = new Uint8Array(marshalledIpnsRecord)

  // validate ipns record is signed by embedded public key
  const ipnsRecord = ipns.unmarshal(marshalledIpnsRecord)
  const publicKey = ipns.extractPublicKey({}, ipnsRecord)
  await ipns.validate(publicKey, ipnsRecord)

  // validate ipns path is the embedded public key
  // in case malicious user tries to submit old ipns record
  const peerCid = await PeerId.createFromPubKey(publicKey.bytes)
  assert(peerCid.equals(PeerId.createFromB58String(ipnsPath)))

  const ipnsValue = uint8ArrayToString(ipnsRecord.value)
  // validate value is a valid cid and nothing weird
  assert(isIpfs.cid(ipnsValue.replace(/^\/ipfs\//, '')))

  return ipnsRecord
}

window.IpnsClient = (...args) => new IpnsClient(...args)
window.ipns = ipns

export default (...args) => new IpnsClient(...args)
