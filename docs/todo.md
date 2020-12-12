layout with theme changer on left
make profile page demo?
pages needed
  - profile
    - 600px width
    - thumbnail
    - banner
    - follow button
    - name
    - user id
    - description
    
  - feed
  
https://2014.jsconf.eu/speakers/sebastian-markbage-minimal-api-surface-area-learning-patterns-instead-of-frameworks.html

possible data in sav3
----
post: a post or reply to a post
post.cid
post.parentPostCid: cid of post replying to
post.previousPostCid: cid of previous post (to be able to iterate through all)
post.publisherCid: cid of publisher (to be able to get profile)
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
