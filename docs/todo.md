todo next
---------

todo before finished prototype
------------------------------
change domains in footer, change domains for token page

highest priority after prototype
--------------------------------
embeds
node based clients to run accounts programatically and headless

todo after prototype
--------------------
script to run node on server
refactor post view into hooks/feed/use-post-replies
if the parent post appears multiple times, merge all the replies, multiple replies will require changing the <Post> component
list of likes on profile
fetch user likes and add them to like count cache
resav3 quote button and design
add reply overtext "john replied"
research metamask integration
research signing in solidity using ipfs private key for userIpnsContent.terminated
automatically get image url from imgur link for profile images
add embeds for imgur, reddit, twitter, youtube, instagram, vimeo, bitchute, gab, soundcloud, rumble, odysee
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
followers/following page
extract sav3-ipfs to npm package
highlight is own reply/resav3 is present on a post
recommended users to follow in sidebar

possible way to do likes
------------------------
possibly use pubsub for likes/retweets counts, but only display the usernames of people in your follow circle so people dont have incentive to spam, possibly use cloudflare country api to get own ip and country, and include it in the like/retweet count statistics?

possible way to do free user/content voting
-------------------------------------------
only use the chain to read sav3 balances, use ipns signed ethereum messages to calculate votes, download all ipns votes and use it to rank stuff
