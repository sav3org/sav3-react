todo next
---------

todo feed
---------
refresh new user cids in the background (or possibly as it happens?)
save some of the feed in localstorage for faster initial load?

todo before finished prototype
------------------------------
refactor data names (ts instead of timestamp, etc)
release version
import/export private key
release version
script to run node
show "replying to" when post is a reply on feed, (need to implement better design for replies like the line on twitter)
like
resav3

todo after prototype
--------------------
if click on post from feed, scroll to that same post when clicking back
loading publish/edit profile indicators
better loading indicators for profile posts
load more than 100 previous posts if scroll to end of profile
load more than 20 previous posts if scroll to end of feed
reply notification
like notification
resav3 notification
report button with IP origin
view other users following
more details about loading on "connecting to peers" component
electron client without webrtc

possible way to do likes
------------------------
possibly use pubsub for likes/retweets counts, but only display the usernames of people in your follow circle so people dont have incentive to spam, possibly use cloudflare country api to get own ip and country, and include it in the like/retweet count statistics?

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

saves
array of user and post cids saved

userIpnsContent
userIpnsContent.pro (userIpnsContent.profileCid)
userIpnsContent.las (userIpnsContent.lastPostCid)
userIpnsContent.fol (userIpnsContent.followingCid)
userIpnsContent.terminated (possibly use ethereum for this so that it never gets unterminated)

possible fancy names: 
"player" instead of "user"
"???" instead of "profile"
"logs" instead of "post"

possible indexeddb modules

https://www.npmjs.com/package/idb
https://www.npmjs.com/package/dexie
https://www.npmjs.com/package/level-js
