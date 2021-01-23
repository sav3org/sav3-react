import {useContext, useState, useEffect} from 'react'
import {FeedContext} from './feed-provider'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:use-feed-posts')

const postsPerPage = 10

const useFeedPosts = () => {
  const {posts, profiles, feedPostCids, parentPosts} = useContext(FeedContext)
  const [postCount, setPostCount] = useState(postsPerPage)
  const [feedPosts, setFeedPosts] = useState([])

  const allFeedPosts = []
  for (const feedPostCid of feedPostCids) {
    if (!posts[feedPostCid]) {
      continue
    }
    allFeedPosts.push(posts[feedPostCid])
  }

  // set feed posts every time new posts are added to context
  useEffect(() => {
    /* algo
      if feed posts length is greater or equal to post count, do nothing
      if feed posts length is greater or equal to all posts length, do nothing
      else
        - sort by timestamp
        - fill until full or run out of posts, make sure to not add posts already added
    */

    // feed posts is already full
    if (feedPosts.length >= postCount) {
      return
    }
    // all posts has no new posts
    if (allFeedPosts.length <= feedPosts.length) {
      return
    }

    const postsNotAddedYet = allFeedPosts.filter((post) => {
      for (const feedPost of feedPosts) {
        if (feedPost.cid === post.cid) {
          return false
        }
      }
      return true
    })
    const postsNotAddedYetSortedByTimestamp = postsNotAddedYet.sort((a, b) => b.timestamp - a.timestamp)

    setFeedPosts((previousFeedPosts) => {
      const nextFeedPosts = JSON.parse(JSON.stringify(previousFeedPosts))
      for (const post of postsNotAddedYetSortedByTimestamp) {
        if (nextFeedPosts.length >= postCount) {
          break
        }

        nextFeedPosts.push(post)
      }

      // set profiles
      for (const nextFeedPost of nextFeedPosts) {
        nextFeedPost.profile = profiles[nextFeedPost.userCid] || {}
      }

      // set parent posts
      for (const nextFeedPost of nextFeedPosts) {
        nextFeedPost.parentPost = parentPosts[nextFeedPost.parentPostCid]
      }

      return nextFeedPosts
    })
  }, [postCount, JSON.stringify(allFeedPosts), JSON.stringify(profiles)])

  // load next posts while scrolling
  const next = () => {
    setPostCount((previousPostCount) => previousPostCount + postsPerPage)
  }

  // go back to page 1, undo all scrolling
  const reset = () => {
    setPostCount(postsPerPage)
    setFeedPosts([])
  }

  // has more posts that can be loaded from scrolling
  const hasMore = allFeedPosts.length > feedPosts.length

  debug({feedPosts, postCount, posts, hasMore})

  return {posts: feedPosts, next, hasMore, reset}
}

export default useFeedPosts
