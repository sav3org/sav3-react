import {useContext, useState} from 'react'
import {FeedContext} from './feed-provider'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:use-home-posts')

const postsPerPage = 10

const useHomePosts = () => {
  const {posts, profiles, homePostCids} = useContext(FeedContext)
  const [postCount, setPostCount] = useState(postsPerPage)

  const allHomePosts = []
  for (const homePostCid of homePostCids) {
    if (!posts[homePostCid]) {
      continue
    }
    allHomePosts.push({...posts[homePostCid], profile: profiles[posts[homePostCid].userCid] || {}})
  }
  const homePosts = allHomePosts.slice(0, postCount)

  // load next posts while scrolling
  const next = () => {
    setPostCount((previousPostCount) => previousPostCount + postsPerPage)
  }

  // go back to page 1, undo all scrolling
  const reset = () => {
    setPostCount(postsPerPage)
  }

  // has more posts that can be loaded from scrolling
  const hasMore = allHomePosts.length > homePosts.length

  debug({homePosts, postCount, posts, hasMore})

  return {posts: homePosts, next, hasMore, reset}
}

export default useHomePosts
