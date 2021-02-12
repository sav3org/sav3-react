import PeerId from 'peer-id'
import assert from 'assert'
// import Debug from 'debug'
import uint8ArrayToString from 'uint8arrays/to-string'
import uint8ArrayFromString from 'uint8arrays/from-string'

import * as localForage from 'localforage'
// const debug = Debug('sav3:sav3-ipfs:api:key')
const database = localForage.createInstance({name: 'sav3ApiKey'})

let peerId

async function initUserPrivateKey () {
  // doesn't need waitForReady because only used in init function

  if (peerId) {
    return
  }

  const base64PrivateKey = await database.getItem('base64PrivateKey')
  if (!base64PrivateKey) {
    peerId = await PeerId.create({keyType: 'RSA', bits: '2048'})
    await database.setItem('base64PrivateKey', uint8ArrayToString(peerId.privKey.bytes, 'base64pad'))
  }
  else {
    peerId = await PeerId.createFromPrivKey(uint8ArrayFromString(base64PrivateKey, 'base64pad'))
  }
}

async function setUserPrivateKey (base64PrivateKey) {
  assert(typeof base64PrivateKey === 'string', 'sav3Ipfs.setUserPrivateKey base64PrivateKey not a string')
  assert(base64PrivateKey !== '', 'sav3Ipfs.setUserPrivateKey base64PrivateKey is empty string')
  assert(isBase64(base64PrivateKey), 'sav3Ipfs.setUserPrivateKey base64PrivateKey not valid base64 encoding')
  await this.waitForReady()
  const privateKey = uint8ArrayFromString(base64PrivateKey, 'base64pad')
  try {
    peerId = await PeerId.createFromPrivKey(privateKey)
  }
  catch (e) {
    // sometimes PeerId.createFromPrivKey(privateKey) throws without stack trace/message
    throw Error(`sav3Ipfs.setUserPrivateKey 'PeerId.createFromPrivKey(privateKey)' failed: ${e.message || 'reason unknown, probably invalid privateKey'}`)
  }
  await database.setItem('base64PrivateKey', base64PrivateKey)
}

async function getUserPeerId () {
  await this.waitForReady()
  return peerId
}

async function getUserPrivateKey () {
  await this.waitForReady()
  return peerId.privKey
}

async function getUserPrivateKeyBase64 () {
  await this.waitForReady()
  return uint8ArrayToString(peerId.privKey.bytes, 'base64pad')
}

const isBase64 = (string) => {
  try {
    window.atob(string)
  }
  catch (e) {
    return false
  }
  return true
}

export default {
  initUserPrivateKey,
  setUserPrivateKey,
  getUserPeerId,
  getUserPrivateKey,
  getUserPrivateKeyBase64
}
