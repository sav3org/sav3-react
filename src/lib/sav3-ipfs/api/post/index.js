import postReplyUtils from './utils/reply'
import postQuoteUtils from './utils/quote'
import postLikeUtils from './utils/like'
import assert from 'assert'
import serialize from '../../utils/serialize'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:api:post')

async function addPost ({content, parentPostCid, quotedPostCid} = {}) {
  await this.waitForReady()
  assert(content || quotedPostCid, `sav3Ipfs.addPost content '${content}' is empty, quotedPostCid '${quotedPostCid}'`)
  assert(!content || typeof content === 'string', `sav3Ipfs.addPost content '${content}' not a string`)
  assert(!content || content.length <= 140, `sav3Ipfs.addPost content '${content}' longer than 140 chars`)
  assert(!parentPostCid || typeof parentPostCid === 'string', `sav3Ipfs.addPost parentPostCid '${parentPostCid}' not a string`)
  assert(!quotedPostCid || typeof quotedPostCid === 'string', `sav3Ipfs.addPost quotedPostCid '${quotedPostCid}' not a string`)
  assert(Boolean(parentPostCid && quotedPostCid) === false, `sav3Ipfs.addPost cannot have both parentPostCid '${parentPostCid}' and quotedPostCid '${quotedPostCid}'`)

  const ipnsContent = await this.getOwnUserIpnsContent()
  const newPost = {}
  newPost.quotedPostCid = quotedPostCid
  newPost.parentPostCid = parentPostCid
  newPost.previousPostCid = ipnsContent.lastPostCid
  newPost.timestamp = Math.round(Date.now() / 1000)
  newPost.userCid = await this.getOwnUserCid()
  if (content) {
    newPost.contentCid = (await this.ipfs.add(content)).cid.toString()
  }

  const newPostCid = (await this.ipfs.add(serialize.serializePost(newPost))).cid.toString()
  const newIpnsContent = {...ipnsContent, lastPostCid: newPostCid}
  const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(newIpnsContent))).cid.toString()

  await this.publishIpnsRecord(newIpnsContentCid)
  debug('addPost', {newIpnsContentCid, newPost, newIpnsContent, ipnsContent, newPostCid, parentPostCid, quotedPostCid})

  if (parentPostCid) {
    await postReplyUtils.cachePostReplyCid({cid: newPostCid, parentPostCid})
  }
  if (quotedPostCid) {
    await postQuoteUtils.cachePostQuoteCid({cid: newPostCid, quotedPostCid})
  }

  return newPostCid
}

// don't use this anywhere because it's synchronous and slow
async function getUserPostsFromLastPostCid (lastPostCid) {
  await this.waitForReady()
  assert(lastPostCid && typeof lastPostCid === 'string', `sav3Ipfs.getUserPostsFromLastPostCid lastPostCid '${lastPostCid}' not a string`)
  const posts = []

  const maxPostCount = 5

  while (true) {
    // no more last post id so reached the first post by that user
    if (!lastPostCid) {
      break
    }
    if (posts.length >= maxPostCount) {
      break
    }

    const post = await this.getPost(lastPostCid)
    lastPostCid = post.previousPostCid
    posts.push(post)
  }

  debug('getUserPostsFromLastPostCid', {lastPostCid, posts})
  return posts
}

async function * getPreviousPostCids (lastPostCid) {
  await this.waitForReady()
  assert(lastPostCid && typeof lastPostCid === 'string', `sav3Ipfs.getPostCidsFromLastPostCid lastPostCid '${lastPostCid}' not a string`)

  let previousPostCid = lastPostCid
  let postCount = 0

  // loop over every post and yield
  while (true) {
    postCount++
    yield previousPostCid
    const post = serialize.deserializePost(await this.getIpfsContent(previousPostCid))
    debug('getPreviousPostCids', {lastPostCid, previousPostCid, post, postCount})
    if (!post.previousPostCid) {
      return
    }
    previousPostCid = post.previousPostCid
  }
}

async function getPost (postCid) {
  await this.waitForReady()
  assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPost postCid '${postCid}' not a string`)
  debug('getPost', {postCid})

  const post = serialize.deserializePost(await this.getIpfsContent(postCid))
  post.cid = postCid

  if (post.parentPostCid) {
    await postReplyUtils.cachePostReplyCid({cid: post.cid, parentPostCid: post.parentPostCid})
  }
  if (post.quotedPostCid) {
    await postQuoteUtils.cachePostQuoteCid({cid: post.cid, quotedPostCid: post.quotedPostCid})
  }
  if (post.contentCid) {
    post.content = await this.getIpfsContent(post.contentCid)
  }

  debug('getPost returns', {postCid, post})
  return post
}

async function getPostReplyCids (postCid) {
  await this.waitForReady()
  assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostReplyCids postCid '${postCid}' not a string`)
  const replyCids = await postReplyUtils.getPostReplyCids(postCid)
  return replyCids
}

async function getPostQuoteCids (postCid) {
  await this.waitForReady()
  assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostQuoteCids postCid '${postCid}' not a string`)
  const quoteCids = await postQuoteUtils.getPostQuoteCids(postCid)
  return quoteCids
}

async function getPostLikeUserCids (postCid) {
  await this.waitForReady()
  assert(postCid && typeof postCid === 'string', `sav3Ipfs.getPostLikeUserCids postCid '${postCid}' not a string`)
  const likeUserCids = await postLikeUtils.getPostLikeUserCids(postCid)
  return likeUserCids
}

export default {
  addPost,
  getUserPostsFromLastPostCid,
  getPreviousPostCids,
  getPost,
  getPostReplyCids,
  getPostQuoteCids,
  getPostLikeUserCids
}
