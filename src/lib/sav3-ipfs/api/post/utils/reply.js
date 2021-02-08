import assert from 'assert'
import Debug from 'debug'

import IdbLru from 'src/lib/utils/idb-lru'
const debug = Debug('sav3:sav3-ipfs:utils:post-reply')
export const postReplyCache = IdbLru({
  name: 'postReplyCache',
  maxSize: 2000
})

export const cachePostReplyCid = async ({cid, parentPostCid} = {}) => {
  assert(cid && typeof cid === 'string', `postReplyUtils.cachePostReplyCid cid '${cid}' not a string`)
  assert(parentPostCid && typeof parentPostCid === 'string', `postReplyUtils.cachePostReplyCid parentPostCid '${parentPostCid}' not a string`)
  const res = await postReplyCache.get(parentPostCid)
  let postReplyCids = {}
  if (res) {
    postReplyCids = JSON.parse(res)
  }
  postReplyCids[cid] = true
  debug('cachePostReplyCid', {cid, parentPostCid, postReplyCids, res})
  await postReplyCache.set(parentPostCid, JSON.stringify(postReplyCids))
}

export const getPostReplyCids = async (postCid) => {
  assert(postCid && typeof postCid === 'string', `postReplyUtils.getPostReplyCids postCid '${postCid}' not a string`)
  const res = await postReplyCache.get(postCid)
  let postReplyCids = []
  if (res) {
    postReplyCids = Object.keys(JSON.parse(res))
  }

  debug('getPostReplyCids', {postCid, postReplyCids, res})
  return postReplyCids
}

export default {
  postReplyCache,
  cachePostReplyCid,
  getPostReplyCids
}
