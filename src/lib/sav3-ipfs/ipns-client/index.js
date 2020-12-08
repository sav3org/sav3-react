import assert from 'assert'
import WebSocketClient from 'socket.io-client'
import EventEmitter from 'events'
import crypto from 'libp2p-crypto'
import ipns from 'ipns'
import delay from 'delay'

class IpnsClient extends EventEmitter {
  constructor ({ipfs} = {}) {
    super()
    assert(ipfs && typeof ipfs === 'object')
    this.ipfs = ipfs
    this.privateKey = null
    this.webSocketClient = null
    this.url = 'https://ipns.sav3.org'

    this.start()
  }

  async start () {
    assert(this.webSocketClient === null)
    this.webSocketClient = WebSocketClient(this.url)
    const encryptedPrivateKeyString = await this.ipfs.key.export('self', 'password')
    this.privateKey = await crypto.keys.import(encryptedPrivateKeyString, 'password')

    // subscribe to new publishes
    this.webSocketClient.on('publish', (ipnsPath, ipnsValue) => {
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
    assert(Array.isArray(ipnsPaths))
    await this.waitForReady()
    const ipnsValues = await new Promise((resolve) => this.webSocketClient.emit('subscribe', ipnsPaths, resolve))
    return ipnsValues
  }

  async unsubscribe (ipnsPaths) {
    assert(Array.isArray(ipnsPaths))
    await this.waitForReady()
    await this.webSocketClient.emit('unsubscribe', ipnsPaths)
  }

  async publish (ipnsPath, ipfsValue) {
    assert(typeof ipnsPath === 'string')
    assert(typeof ipfsValue === 'string')
    await this.waitForReady()

    // mock values for now, ipns server does not validate them
    const sequence = 0
    const validity = 1000 * 60 * 60 * 24 * 365 * 10 // 10 years

    const record = await ipns.create(this.privateKey, ipfsValue, sequence, validity)
    await ipns.embedPublicKey(this.privateKey.public, record) // required to verify marshalled record
    const marshalledRecord = Buffer.from(ipns.marshal(record))

    await this.webSocketClient.emit('publish', ipnsPath, marshalledRecord)
  }
}

window.IpnsClient = (...args) => new IpnsClient(...args)

export default (...args) => new IpnsClient(...args)
