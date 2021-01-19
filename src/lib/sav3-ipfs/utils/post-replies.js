import assert from 'assert'
import Debug from 'debug'

import IdbLru from 'src/lib/utils/idb-lru'
const debug = Debug('sav3:sav3-ipfs:utils:post-replies')
export const postRepliesCache = IdbLru({
  name: 'postRepliesCache',
  maxSize: 2000
})

export const cachePostReplyCid = async ({cid, parentPostCid} = {}) => {
  assert(cid && typeof cid === 'string', `postRepliesUtils.cachePostReplyCid cid '${cid}' not a string`)
  assert(parentPostCid && typeof parentPostCid === 'string', `postRepliesUtils.cachePostReplyCid parentPostCid '${parentPostCid}' not a string`)
  const res = await postRepliesCache.get(parentPostCid)
  let postRepliesCids = {}
  if (res) {
    postRepliesCids = JSON.parse(res)
  }
  postRepliesCids[cid] = true
  debug('cachePostReplyCid', {cid, parentPostCid, postRepliesCids, res})
  await postRepliesCache.set(parentPostCid, JSON.stringify(postRepliesCids))
}

export const getPostRepliesCids = async (postCid) => {
  assert(postCid && typeof postCid === 'string', `postRepliesUtils.getPostRepliesCids postCid '${postCid}' not a string`)
  const res = await postRepliesCache.get(postCid)
  let postRepliesCids = []
  if (res) {
    postRepliesCids = Object.keys(JSON.parse(res))
  }

  debug('getPostRepliesCids', {postCid, postRepliesCids, res})
  return postRepliesCids
}

export default {
  postRepliesCache,
  cachePostReplyCid,
  getPostRepliesCids
}
