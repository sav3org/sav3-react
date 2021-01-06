import localStorageMemoize from 'src/lib/utils/local-storage-memoize'
import config from 'src/config'
import assert from 'assert'
import isIpfs from 'is-ipfs'

export const getBootstrapUsersCids = async () => {
  try {
    const cids = await fetchBootstrapUsersCidsFromGoogleSheet()
    return cids
  }
  catch (e) {
    console.error(e)
    return []
  }
}

const _fetchBootstrapUsersCidsFromGoogleSheet = async () => {
  const googleSheetId = config.bootstrapUsersGoogleSheetId
  assert(googleSheetId && typeof googleSheetId === 'string', `fetchBootstrapUsersCidsFromGoogleSheet invalid google sheet id '${googleSheetId}'`)
  let res
  const bootstrapUsers = []
  try {
    res = await fetch(`https://docs.google.com/spreadsheets/d/${googleSheetId}/export?format=csv`)
    res = await res.text()
    res = res.split('\n')
    for (const userCid of res) {
      if (isIpfs.cid(userCid.trim())) {
        bootstrapUsers.push(userCid.trim())
      }
    }
  }
  catch (e) {
    throw Error(`failed fetching bootstrap users from google sheet '${googleSheetId}' response '${res}': ${e.message}`)
  }
  return bootstrapUsers
}
const oneHour = 1000 * 60 * 60
const fetchBootstrapUsersCidsFromGoogleSheet = localStorageMemoize(_fetchBootstrapUsersCidsFromGoogleSheet, {maxAge: oneHour})

export default {
  getBootstrapUsersCids
}
