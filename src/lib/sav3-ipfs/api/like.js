import postLikeUtils from './post/utils/like'
import assert from 'assert'
import serialize from '../utils/serialize'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:api:like')

async function addLike (postCid) {
  await this.waitForReady()
  assert(postCid || typeof postCid === 'string', `sav3Ipfs.addLike postCid '${postCid}' not a string`)

  const ipnsContent = await this.getOwnUserIpnsContent()
  const newLike = {}
  newLike.postCid = postCid
  newLike.previousLikeCid = ipnsContent.lastLikeCid
  newLike.timestamp = Math.round(Date.now() / 1000)
  // don't include user cid because there's no way to validate it
  // and there's never a need to fetch a like without fetching the user first

  const newLikeCid = (await this.ipfs.add(serialize.serializeLike(newLike))).cid.toString()
  const newIpnsContent = {...ipnsContent, lastLikeCid: newLikeCid}
  const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(newIpnsContent))).cid.toString()

  await this.publishIpnsRecord(newIpnsContentCid)
  debug('addLike', {newIpnsContentCid, newLike, newIpnsContent, ipnsContent, newLikeCid})

  // cache own like to display like count on posts
  const userCid = await this.getOwnUserCid()
  await postLikeUtils.cachePostLikeUserCid({postCid, userCid})

  return newLikeCid
}

export default {
  addLike
}
