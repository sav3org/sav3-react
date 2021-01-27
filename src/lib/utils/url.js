import assert from 'assert'
import config from 'src/config'
import Debug from 'debug'
const debug = Debug('sav3:utils:url')

const timeToLive = config.urlTimeToLive
assert(typeof timeToLive === 'number', `invalid permalink time to live '${timeToLive}'`)

export const decodeCid = (encodedCid) => {
  assert(encodedCid && typeof encodedCid === 'string', `utils.url.decodeCid encodedCid '${encodedCid}' not a string`)
  let cid, expireTimestamp, cipheredCid
  try {
    const res = window.atob(encodedCid).split(',')
    cipheredCid = res[0]
    expireTimestamp = res[1]
    cid = decipherCid(cipheredCid, expireTimestamp)
  }
  catch (e) {
    throw Error(`failed decoding cid: ${e.message}`)
  }

  if (expireTimestamp * 1000 < Date.now()) {
    throw Error(`encoded cid '${cid}' expired '${new Date(expireTimestamp * 1000)}'`)
  }
  if (expireTimestamp * 1000 - timeToLive >= Date.now()) {
    throw Error(`encoded cid '${cid}' too early, expires: '${new Date(expireTimestamp * 1000)}', now: '${new Date()}'`)
  }
  debug('decodeCid', {cid, expireTimestamp, cipheredCid})
  return cid
}

export const encodeCid = (cid) => {
  assert(cid && typeof cid === 'string', `utils.url.encodeCid cid '${cid}' not a string`)
  const expireTimestamp = Math.floor((Date.now() + timeToLive) / 1000) // use Math.floor because can expire too early with Math.round
  const cipheredCid = cipherCid(cid, expireTimestamp)
  debug('encodeCid', {cid, expireTimestamp, cipheredCid})
  return window.btoa(`${cipheredCid},${expireTimestamp}`).replace(/=/g, '')
}

export const encodedCidIsExpired = (encodedCid) => {
  try {
    decodeCid(encodedCid)
    return false
  }
  catch (e) {
    debug('encodedCidIsExpired', e.message)
    return true
  }
}

// cipher the cids a bit so urls look more random
// higher numbers bug out sometimes
const cipherNumber = 7

const cipherCid = (cid, expireTimestamp) => {
  const number = expireTimestamp % cipherNumber
  let ciphered = ''
  while (ciphered.length < cid.length) {
    const index = ciphered.length
    const letter = String.fromCharCode(cid.charCodeAt(index) + number)
    ciphered += letter
  }
  return ciphered
}

const decipherCid = (cid, expireTimestamp) => {
  const number = expireTimestamp % cipherNumber
  let deciphered = ''
  while (deciphered.length < cid.length) {
    const index = deciphered.length
    const letter = String.fromCharCode(cid.charCodeAt(index) - number)
    deciphered += letter
  }
  return deciphered
}

export default {
  decodeCid,
  encodeCid,
  encodedCidIsExpired
}
