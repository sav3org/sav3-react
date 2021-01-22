todo next
---------

todo before finished prototype
------------------------------
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
block button and block implementation
save some of the feed in localstorage for faster initial load?

possible way to do likes
------------------------
possibly use pubsub for likes/retweets counts, but only display the usernames of people in your follow circle so people dont have incentive to spam, possibly use cloudflare country api to get own ip and country, and include it in the like/retweet count statistics?
