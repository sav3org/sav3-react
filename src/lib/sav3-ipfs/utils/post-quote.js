import assert from 'assert'
import Debug from 'debug'

import IdbLru from 'src/lib/utils/idb-lru'
const debug = Debug('sav3:sav3-ipfs:utils:post-quote')
export const postQuoteCache = IdbLru({
  name: 'postQuoteCache',
  maxSize: 2000
})

export const cachePostQuoteCid = async ({cid, quotedPostCid} = {}) => {
  assert(cid && typeof cid === 'string', `postQuoteUtils.cachePostQuoteCid cid '${cid}' not a string`)
  assert(quotedPostCid && typeof quotedPostCid === 'string', `postQuoteUtils.cachePostQuoteCid quotedPostCid '${quotedPostCid}' not a string`)
  const res = await postQuoteCache.get(quotedPostCid)
  let postQuoteCids = {}
  if (res) {
    postQuoteCids = JSON.parse(res)
  }
  postQuoteCids[cid] = true
  debug('cachePostQuoteCid', {cid, quotedPostCid, postQuoteCids, res})
  await postQuoteCache.set(quotedPostCid, JSON.stringify(postQuoteCids))
}

export const getPostQuoteCids = async (postCid) => {
  assert(postCid && typeof postCid === 'string', `postQuoteUtils.getPostQuoteCids postCid '${postCid}' not a string`)
  const res = await postQuoteCache.get(postCid)
  let postQuoteCids = []
  if (res) {
    postQuoteCids = Object.keys(JSON.parse(res))
  }

  debug('getPostQuoteCids', {postCid, postQuoteCids, res})
  return postQuoteCids
}

export default {
  postQuoteCache,
  cachePostQuoteCid,
  getPostQuoteCids
}
