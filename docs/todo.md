todo next
---------

todo before finished prototype
------------------------------
renew sav3 server
import/export private key
release version
script to run node
resav3
like
after like and resav3 are implemented:
  refactor post view into hooks/feed/use-post-replies

todo after prototype
--------------------
research metamask integration
research signing in solidity using ipfs private key for userIpnsContent.terminated
automatically get image url from imgur link for profile images
add embeds for imgur, reddit, twitter, youtube, instagram, vimeo, bitchute, gab
add drag and drop media uploads to cloudflare ipfs
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
protect agaisnt fake giant data that waste bandwidth
redo /post/ view to a full width post like twitter
improve design of useParentPostsWithProfiles to possibly integrate it with the feed provider instead of being seperate hook
fix reply duplicates, possible solution, if the same parent post shows on a feed page, merge them into a single thread
write jest/enzyme tests for hooks by mocking sav3Ipfs

possible way to do likes
------------------------
possibly use pubsub for likes/retweets counts, but only display the usernames of people in your follow circle so people dont have incentive to spam, possibly use cloudflare country api to get own ip and country, and include it in the like/retweet count statistics?
