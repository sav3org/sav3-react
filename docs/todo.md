make profile page


make profile page demo?
hooks
  - use user posts
  - user user profile
  - use user following
  - use feed posts
  



possible data in sav3
----
post: a post or reply to a post
post.cid
post.parentPostCid: cid of post replying to
post.previousPostCid: cid of previous post (to be able to iterate through all)
post.userCid: cid of publisher (to be able to get profile)
post.contentCid: cid of content (max 140 chars)
post.timestamp: seconds

profile: the profile of a user
profile.diplayNameCid
profile.descriptionCid
profile.thumbnailUrlCid

saves
array of user and post cids saved

ipnsData
profileCid
lastPostCid
saves
isTerminated (possibly use ethereum for this so that it never gets unterminated)

possible fancy names: 
"player" instead of "user"
"???" instead of "profile"
"logs" instead of "post"

possible indexeddb modules

https://www.npmjs.com/package/idb
https://www.npmjs.com/package/dexie
https://www.npmjs.com/package/level-js
