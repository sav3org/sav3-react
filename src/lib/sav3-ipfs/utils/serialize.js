/*

data in sav3
----
post: a post or reply to a post
post.cid
post.quo (post.quotedPostCid): cid of post quoted (resav3)
post.par (post.parentPostCid): cid of post replying to
post.pre (post.previousPostCid): cid of previous post (to be able to iterate through all)
post.usr (post.userCid): cid of publisher (to be able to get profile)
post.cnt (post.contentCid): cid of content (max 140 chars)
post.tmp (post.timestamp): seconds

profile: the profile of a user
profile.nam (profile.diplayNameCid)
profile.des (profile.descriptionCid)
profile.thu (profile.thumbnailUrlCid)
profile.ban (profile.bannerUrlCid)

like
like.pst (like.postCid)
like.pre (like.previousLikeCid)
like.tmp (like.timestamp)
like.usr (like.userCid)

following: array of user cids that a user is following

userUserIpnsContent: latest ipns record of a user, contains pointers to a user's latest data
userUserIpnsContent.pro (userUserIpnsContent.profileCid)
userUserIpnsContent.las (userUserIpnsContent.lastPostCid)
userUserIpnsContent.fol (userUserIpnsContent.followingCid)
userUserIpnsContent.terminated? (possibly use ethereum for this so that it never gets unterminated)

*/

import assert from 'assert'

export const serializePost = (post) => {
  // validate mandatory post fields
  assert(post && typeof post === 'object', `invalid post '${JSON.stringify(post)}' post not an object`)
  assert(post.userCid && typeof post.userCid === 'string', `invalid post '${JSON.stringify(post)}' post.userCid not a string`)
  assert(post.timestamp && typeof post.timestamp === 'number', `invalid post '${JSON.stringify(post)}' post.timestamp not a number`)
  // validate optional post fields
  assert(post.contentCid === undefined || (post.contentCid && typeof post.contentCid === 'string'), `invalid post '${JSON.stringify(post)}' post.contentCid not a string`)
  assert(post.parentPostCid === undefined || (post.parentPostCid && typeof post.parentPostCid === 'string'), `invalid post '${JSON.stringify(post)}' post.parentPostCid not a string`)
  assert(post.previousPostCid === undefined || (post.previousPostCid && typeof post.previousPostCid === 'string'), `invalid post '${JSON.stringify(post)}' post.previousPostCid not a string`)

  const serializedPost = {
    usr: post.userCid,
    tmp: post.timestamp
  }
  if (post.contentCid) {
    serializedPost.cnt = post.contentCid
  }
  if (post.parentPostCid) {
    serializedPost.par = post.parentPostCid
  }
  if (post.previousPostCid) {
    serializedPost.pre = post.previousPostCid
  }
  if (post.quotedPostCid) {
    serializedPost.quo = post.quotedPostCid
  }
  return JSON.stringify(serializedPost)
}

export const deserializePost = (data) => {
  validateData(data)
  data = toObject(data)

  // validate mandatory post fields
  assert(data.usr && typeof data.usr === 'string', `invalid post '${JSON.stringify(data)}' post.usr not a string`)
  assert(data.tmp && typeof data.tmp === 'number', `invalid post '${JSON.stringify(data)}' post.tmp not a number`)

  const post = {
    userCid: data.usr,
    contentCid: data.cnt,
    timestamp: data.tmp,
    quotedPostCid: data.quo,
    parentPostCid: data.par,
    previousPostCid: data.pre
  }
  return post
}

export const serializeLike = (like) => {
  // validate mandatory like fields
  assert(like && typeof like === 'object', `invalid like '${JSON.stringify(like)}' like not an object`)
  assert(like.timestamp && typeof like.timestamp === 'number', `invalid like '${JSON.stringify(like)}' like.timestamp not a number`)
  assert(like.postCid && typeof like.postCid === 'string', `invalid like '${JSON.stringify(like)}' like.postCid not a string`)

  // validate optional like fields
  assert(like.previousLikeCid === undefined || (like.previousLikeCid && typeof like.previousLikeCid === 'string'), `invalid like '${JSON.stringify(like)}' like.previousLikeCid not a string`)

  const serializedLike = {
    pst: like.postCid,
    tmp: like.timestamp
  }
  if (like.previousLikeCid) {
    serializedLike.pre = like.previousLikeCid
  }
  return JSON.stringify(serializedLike)
}

export const deserializeLike = (data) => {
  validateData(data)
  data = toObject(data)

  // validate mandatory like fields
  assert(data.pst && typeof data.pst === 'string', `invalid like '${JSON.stringify(data)}' like.pst not a string`)
  assert(data.tmp && typeof data.tmp === 'number', `invalid like '${JSON.stringify(data)}' like.tmp not a number`)

  const like = {
    postCid: data.pst,
    timestamp: data.tmp,
    previousLikeCid: data.pre
  }
  return like
}

export const serializeUserIpnsContent = (userIpnsContent) => {
  assert(userIpnsContent && typeof userIpnsContent === 'object', `invalid userIpnsContent '${JSON.stringify(userIpnsContent)}' userIpnsContent not an object`)

  const serializedUserIpnsContent = {}
  if (userIpnsContent.profileCid) {
    serializedUserIpnsContent.pro = userIpnsContent.profileCid
  }
  if (userIpnsContent.lastPostCid) {
    serializedUserIpnsContent.las = userIpnsContent.lastPostCid
  }
  if (userIpnsContent.followingCid) {
    serializedUserIpnsContent.fol = userIpnsContent.followingCid
  }
  return JSON.stringify(serializedUserIpnsContent)
}

export const deserializeUserIpnsContent = (data) => {
  validateData(data)
  data = toObject(data)
  const userIpnsContent = {
    profileCid: data.pro,
    lastPostCid: data.las,
    followingCid: data.fol
  }
  return userIpnsContent
}

export const serializeProfile = (profile) => {
  assert(profile && typeof profile === 'object', `invalid profile '${JSON.stringify(profile)}' profile not an object`)

  const serializedProfile = {}
  if (profile.diplayNameCid) {
    serializedProfile.nam = profile.diplayNameCid
  }
  if (profile.descriptionCid) {
    serializedProfile.des = profile.descriptionCid
  }
  if (profile.thumbnailUrlCid) {
    serializedProfile.thu = profile.thumbnailUrlCid
  }
  if (profile.bannerUrlCid) {
    serializedProfile.ban = profile.bannerUrlCid
  }
  return JSON.stringify(serializedProfile)
}

export const deserializeProfile = (data) => {
  validateData(data)
  data = toObject(data)
  const profile = {
    diplayNameCid: data.nam,
    descriptionCid: data.des,
    thumbnailUrlCid: data.thu,
    bannerUrlCid: data.ban
  }
  return profile
}

const validateData = (data) => {
  assert(data && (typeof data === 'string' || typeof data === 'object'), `invalid data to serialize '${data}' not a string or object`)
}

const toObject = (data) => {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    }
    catch (e) {
      throw Error(`invalid data to serialize '${data}' not valid json: ${e.message}`)
    }
  }
  return data
}

export default {
  deserializePost,
  deserializeLike,
  deserializeProfile,
  deserializeUserIpnsContent,
  serializePost,
  serializeLike,
  serializeProfile,
  serializeUserIpnsContent
}
