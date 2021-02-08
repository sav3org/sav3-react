import assert from 'assert'
import Debug from 'debug'

import IdbLru from 'src/lib/utils/idb-lru'
const debug = Debug('sav3:sav3-ipfs:utils:post-like')
export const postLikeCache = IdbLru({
  name: 'postLikeCache',
  maxSize: 2000
})

export const cachePostLikeUserCid = async ({postCid, userCid} = {}) => {
  assert(postCid && typeof postCid === 'string', `postLikeUtils.cachePostLikeUserCid postCid '${postCid}' not a string`)
  assert(userCid && typeof userCid === 'string', `postLikeUtils.cachePostLikeUserCid userCid '${userCid}' not a string`)
  const res = await postLikeCache.get(postCid)
  let postLikeUserCids = {}
  if (res) {
    postLikeUserCids = JSON.parse(res)
  }
  postLikeUserCids[userCid] = true
  debug('cachePostLikeUserCid', {userCid, postCid, postLikeUserCids, res})
  await postLikeCache.set(postCid, JSON.stringify(postLikeUserCids))
}

export const getPostLikeUserCids = async (postCid) => {
  assert(postCid && typeof postCid === 'string', `postLikeUtils.getPostLikeUserCids postCid '${postCid}' not a string`)
  const res = await postLikeCache.get(postCid)
  let postLikeUserCids = []
  if (res) {
    postLikeUserCids = Object.keys(JSON.parse(res))
  }

  debug('getPostLikeUserCids', {postCid, postLikeUserCids, res})
  return postLikeUserCids
}

export default {
  postLikeCache,
  cachePostLikeUserCid,
  getPostLikeUserCids
}
