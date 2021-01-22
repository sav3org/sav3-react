/*

data in sav3
----
post: a post or reply to a post
post.cid
post.par (post.parentPostCid): cid of post replying to
post.pre (post.previousPostCid): cid of previous post (to be able to iterate through all)
post.usr (post.userCid): cid of publisher (to be able to get profile)
post.cnt (post.contentCid): cid of content (max 140 chars)
post.tmp (post.timestamp): seconds

profile: the profile of a user
profile.nam (profile.diplayNameCid)
profile.des (profile.descriptionCid)
profile.thu (profile.thumbnailUrlCid)

saves?
array of user and post cids saved?

following: array of user cids a user is following

userUserIpnsContent: latest ipns record of a user, contains pointers to a user's latest data
userUserIpnsContent.pro (userUserIpnsContent.profileCid)
userUserIpnsContent.las (userUserIpnsContent.lastPostCid)
userUserIpnsContent.fol (userUserIpnsContent.followingCid)
userUserIpnsContent.terminated? (possibly use ethereum for this so that it never gets unterminated)

*/

import assert from 'assert'

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

export const deserializePost = (data) => {
  validateData(data)
  data = toObject(data)

  // validate mandatory post fields
  assert(data.usr && typeof data.usr === 'string', `invalid post '${JSON.stringify(data)}' post.usr not a string`)
  assert(data.cnt && typeof data.cnt === 'string', `invalid post '${JSON.stringify(data)}' post.cnt not a string`)
  assert(data.tmp && typeof data.tmp === 'number', `invalid post '${JSON.stringify(data)}' post.tmp not a number`)

  const post = {
    userCid: data.usr,
    contentCid: data.cnt,
    timestamp: data.tmp,
    parentPostCid: data.par,
    previousPostCid: data.pre
  }
  return post
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

export const serializePost = (post) => {
  // validate mandatory post fields
  assert(post && typeof post === 'object', `invalid post '${JSON.stringify(post)}' post not an object`)
  assert(post.userCid && typeof post.userCid === 'string', `invalid post '${JSON.stringify(post)}' post.userCid not a string`)
  assert(post.contentCid && typeof post.contentCid === 'string', `invalid post '${JSON.stringify(post)}' post.contentCid not a string`)
  assert(post.timestamp && typeof post.timestamp === 'number', `invalid post '${JSON.stringify(post)}' post.timestamp not a number`)
  // validate optional post fields
  assert(post.parentPostCid === undefined || (post.parentPostCid && typeof post.parentPostCid === 'string'), `invalid post '${JSON.stringify(post)}' post.parentPostCid not a string`)
  assert(post.previousPostCid === undefined || (post.previousPostCid && typeof post.previousPostCid === 'string'), `invalid post '${JSON.stringify(post)}' post.previousPostCid not a string`)

  const serializedPost = {
    usr: post.userCid,
    cnt: post.contentCid,
    tmp: post.timestamp
  }
  if (post.parentPostCid) {
    serializedPost.par = post.parentPostCid
  }
  if (post.previousPostCid) {
    serializedPost.pre = post.previousPostCid
  }
  return JSON.stringify(serializedPost)
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

export default {
  deserializePost,
  deserializeProfile,
  deserializeUserIpnsContent,
  serializePost,
  serializeProfile,
  serializeUserIpnsContent
}
