import assert from 'assert'
import IdbLru from 'src/lib/utils/IdbLru'

const getIsoCountryCodeFromIpAttempts = new Set()
const ipIsoCountryCodeCache = IdbLru({name: 'ipIsoCountryCodeCache', maxSize: 500})

/**
 * return iso country code if cached, if not attempt to cache it
 * @param {String} ip
 * @returns {Promise<String>} country iso code
 */
export const getIsoCountryCodeFromIpCached = async (ip) => {
  const isoCountryCode = await ipIsoCountryCodeCache.get(ip)
  if (isoCountryCode) {
    return isoCountryCode
  }

  if (!getIsoCountryCodeFromIpAttempts.has(ip)) {
    getIsoCountryCodeFromIpAttempts.add(ip)
    getIsoCountryCodeFromIp(ip)
      .then(isoCountryCode => ipIsoCountryCodeCache.set(ip, isoCountryCode))
      .catch(e => console.log(e))
  }

  throw Error(`iso country code for ip '${ip}' not cached yet`)
}

/**
 * @param {String} ip
 * @returns {Promise<String>} country iso code
 */
export const getIsoCountryCodeFromIp = async (ip) => {
  assert(typeof ip === 'string', `invalid ip '${ip}' not a string`)

  const apiUrl = `https://ipapi.co/${ip}/country/`
  let isoCountryCode, res
  try {
    res = await fetch(apiUrl)
    res = await res.text()
    isoCountryCode = res.trim().toUpperCase()
    assertIsIsoCountryCode(isoCountryCode)
  }
  catch (e) {
    e.message = `failed getting country iso code from '${apiUrl}' response '${res}': ${e.message}`
    throw e
  }
  return isoCountryCode
}

/**
 * @param {String[]} ips
 * @returns {Promise<String[]>} country iso codes
 */
export const getIsoCountryCodesFromIps = async (ips) => {
  const promises = []
  for (const ip of ips) {
    promises.push(getIsoCountryCodeFromIp(ip))
  }
  return Promise.all(promises)
}

/**
 * @param {String} isoCountryCode
 * @returns {String} country flag emoji
 */
export const isoCountryCodeToCountryFlagEmoji = (isoCountryCode) => {
  assertIsIsoCountryCode(isoCountryCode)
    // offset between uppercase ascii and regional indicator symbols
  const charOffset = 127397
  const chars = [...isoCountryCode.toUpperCase()].map(c => c.charCodeAt() + charOffset)
  return String.fromCodePoint(...chars)
}

/**
 * @param {String} isoCountryCode
 */
const assertIsIsoCountryCode = (isoCountryCode) => {
  const countryCodeRegex = /^[a-z]{2}$/i
  const isoCountryCodeType = typeof isoCountryCode
  assert(countryCodeRegex.test(isoCountryCode), `isoCountryCode must be an ISO 3166-1 alpha-2 string, but got '${isoCountryCodeType === 'string' ? isoCountryCode : isoCountryCodeType}' instead`)
}

export default {
  getIsoCountryCodeFromIpCached,
  getIsoCountryCodeFromIp,
  getIsoCountryCodesFromIps,
  isoCountryCodeToCountryFlagEmoji
}
