import assert from 'assert'

import IdbLru from 'src/lib/utils/idb-lru'
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
  console.log('postRepliesUtils.cachePostReplyCid', {cid, parentPostCid, postRepliesCids, res})
  await postRepliesCache.set(parentPostCid, JSON.stringify(postRepliesCids))
}

export const getPostRepliesCids = async (postCid) => {
  assert(postCid && typeof postCid === 'string', `postRepliesUtils.getPostRepliesCids postCid '${postCid}' not a string`)
  const res = await postRepliesCache.get(postCid)
  let postRepliesCids = []
  if (res) {
    postRepliesCids = Object.keys(JSON.parse(res))
  }

  // console.log('postRepliesUtils.getPostRepliesCids', {postCid, postRepliesCids, res})
  return postRepliesCids
}

export default {
  postRepliesCache,
  cachePostReplyCid,
  getPostRepliesCids
}
