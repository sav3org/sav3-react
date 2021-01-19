import assert from 'assert'
import config from 'src/config'

const timeToLive = config.urlTimeToLive
assert(typeof timeToLive === 'number', `invalid permalink time to live '${timeToLive}'`)

export const decodeCid = (encodedCid) => {
  assert(encodedCid && typeof encodedCid === 'string', `utils.url.decodeCid encodedCid '${encodedCid}' not a string`)
  let cid, expireTimestamp
  try {
    const object = JSON.parse(window.atob(encodedCid))
    cid = object.c
    expireTimestamp = object.e
  }
  catch (e) {
    throw Error(`failed decoding cid: ${e.message}`)
  }

  if (expireTimestamp * 1000 < Date.now()) {
    throw Error(`encoded cid '${cid}' expired ${new Date(expireTimestamp * 1000)}`)
  }
  if (expireTimestamp * 1000 - timeToLive >= Date.now()) {
    throw Error(`encoded cid '${cid}' too early '${new Date(expireTimestamp * 1000)}' '${new Date()}'`)
  }
  return cid
}

export const encodeCid = (cid) => {
  assert(cid && typeof cid === 'string', `utils.url.encodeCid cid '${cid}' not a string`)
  const expireTimestamp = Math.round((Date.now() + timeToLive) / 1000)
  return window.btoa(JSON.stringify({c: cid, e: expireTimestamp})).replace(/=/g, '')
}

export const encodedCidIsExpired = (encodedCid) => {
  try {
    decodeCid(encodedCid)
    return false
  }
  catch (e) {
    return true
  }
}

export default {
  decodeCid,
  encodeCid,
  encodedCidIsExpired
}
