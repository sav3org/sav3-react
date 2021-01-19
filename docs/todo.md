todo next
---------

todo feed
---------
sorting and loading new posts algo
refresh new user cids in the background (or possibly as it happens?)

todo before finished prototype
------------------------------
more than 5 posts per user, sort them by time, and cap the amount of posts per user
refactor data names (ts instead of timestamp, etc), hook names (plurals need consistency), sav3 function names
show "replying to" when post is a reply on feed, (need to implement better design for replies like the line on twitter)
add debug module instead of console.log
like
resav3
import/export private key

todo after prototype
--------------------
loading publish/edit profile indicators
better loading indicators for profile posts
load more than 100 previous posts if scroll to end
reply notification
like notification
resav3 notification
report button with IP origin
view other users following

possible way to do likes
------------------------
possibly use pubsub for likes/retweets counts, but only display the usernames of people in your follow circle so people dont have incentive to spam, possibly use cloudflare country api to get own ip and country, and include it in the like/retweet count statistics?

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

userIpnsContent
userIpnsContent.profileCid
userIpnsContent.lastPostCid
userIpnsContent.followingCid
userIpnsContent.isTerminated (possibly use ethereum for this so that it never gets unterminated)

possible fancy names: 
"player" instead of "user"
"???" instead of "profile"
"logs" instead of "post"

possible indexeddb modules

https://www.npmjs.com/package/idb
https://www.npmjs.com/package/dexie
https://www.npmjs.com/package/level-js
