import assert from 'assert'
import serialize from '../utils/serialize'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:api:following')

async function setFollowing (userCids) {
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

async function getUserFollowing (userCid) {
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

export default {
  setFollowing,
  getUserFollowing
}
