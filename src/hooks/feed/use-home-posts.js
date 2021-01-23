import {useContext, useState, useEffect} from 'react'
import {FeedContext} from './feed-provider'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:use-home-posts')

const postsPerPage = 10

const useHomePosts = () => {
  const {posts, profiles, homePostCids, parentPosts} = useContext(FeedContext)
  const [postCount, setPostCount] = useState(postsPerPage)
  const [homePosts, setHomePosts] = useState([])

  const allHomePosts = []
  for (const homePostCid of homePostCids) {
    if (!posts[homePostCid]) {
      continue
    }
    allHomePosts.push(posts[homePostCid])
  }

  // set home posts every time new posts are added to context
  useEffect(() => {
    /* algo
      if home posts length is greater or equal to post count, do nothing
      if home posts length is greater or equal to all posts length, do nothing
      else
        - sort by timestamp
        - fill until full or run out of posts, make sure to not add posts already added
    */

    // home posts is already full
    if (homePosts.length >= postCount) {
      return
    }
    // all posts has no new posts
    if (allHomePosts.length <= homePosts.length) {
      return
    }

    const postsNotAddedYet = allHomePosts.filter((post) => {
      for (const homePost of homePosts) {
        if (homePost.cid === post.cid) {
          return false
        }
      }
      return true
    })
    const postsNotAddedYetSortedByTimestamp = postsNotAddedYet.sort((a, b) => b.timestamp - a.timestamp)

    setHomePosts((previousHomePosts) => {
      const nextHomePosts = JSON.parse(JSON.stringify(previousHomePosts))
      for (const post of postsNotAddedYetSortedByTimestamp) {
        if (nextHomePosts.length >= postCount) {
          break
        }

        nextHomePosts.push(post)
      }

      // set profiles
      for (const nextHomePost of nextHomePosts) {
        nextHomePost.profile = profiles[nextHomePost.userCid] || {}
      }

      // set parent posts
      for (const nextHomePost of nextHomePosts) {
        nextHomePost.parentPost = parentPosts[nextHomePost.parentPostCid]
      }

      return nextHomePosts
    })
  }, [postCount, JSON.stringify(allHomePosts), JSON.stringify(profiles)])

  // load next posts while scrolling
  const next = () => {
    setPostCount((previousPostCount) => previousPostCount + postsPerPage)
  }

  // go back to page 1, undo all scrolling
  const reset = () => {
    setPostCount(postsPerPage)
    setHomePosts([])
  }

  // has more posts that can be loaded from scrolling
  const hasMore = allHomePosts.length > homePosts.length

  debug({homePosts, postCount, posts, hasMore})

  return {posts: homePosts, next, hasMore, reset}
}

export default useHomePosts
