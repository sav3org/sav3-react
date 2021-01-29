import {useState, useEffect} from 'react'
import useUserPostCids from 'src/hooks/user/use-user-post-cids'
import usePosts from 'src/hooks/post/use-posts'
import useUsersProfiles from 'src/hooks/user/use-users-profiles'
import usePrevious from 'src/hooks/utils/use-previous'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:use-user-posts')

const postsPerPage = 10

const useUserPosts = (userCid) => {
  const previousUserCid = usePrevious(userCid)
  const userPostCids = useUserPostCids(userCid)
  const posts = usePosts(userPostCids)
  const postsUserCids = getUserCidsFromPosts(posts)
  const postsUserCidsSet = new Set(postsUserCids)
  if (userCid) {
    postsUserCidsSet.add(userCid)
  }
  const profiles = useUsersProfiles([...postsUserCidsSet])

  const [postCount, setPostCount] = useState(postsPerPage)
  const [userPosts, setUserPosts] = useState([])

  const allUserPosts = []
  for (const userPostCid of userPostCids) {
    if (!posts[userPostCid]) {
      continue
    }
    allUserPosts.push(posts[userPostCid])
  }

  // load next posts while scrolling
  const next = () => {
    setPostCount((previousPostCount) => previousPostCount + postsPerPage)
  }

  // go back to page 1, undo all scrolling
  const reset = () => {
    setPostCount(postsPerPage)
    setUserPosts([])
  }

  // has more posts that can be loaded from scrolling
  const hasMore = allUserPosts.length > userPosts.length

  // set user posts every time new posts are added to context
  useEffect(() => {
    // user has changed
    if (previousUserCid && previousUserCid !== userCid) {
      reset()
    }

    /* algo
      if user posts length is greater or equal to post count, do nothing
      if user posts length is greater or equal to all posts length, do nothing
      else
        - sort by timestamp
        - fill until full or run out of posts, make sure to not add posts already added
    */

    // user posts is already full
    if (userPosts.length >= postCount) {
      return
    }
    // all posts has no new posts
    if (allUserPosts.length <= userPosts.length) {
      return
    }

    const postsSortedByTimestamp = allUserPosts.sort((a, b) => b.timestamp - a.timestamp)

    // don't use previous posts in user feed, always put newest post at top
    // which should be superior user experience
    setUserPosts((previousUserPosts) => {
      const nextUserPosts = []
      for (const post of postsSortedByTimestamp) {
        if (nextUserPosts.length >= postCount) {
          break
        }
        nextUserPosts.push(post)
      }
      return nextUserPosts
    })
  }, [userCid, postCount, JSON.stringify(allUserPosts), JSON.stringify(profiles)])

  // add all data to posts
  const postsWithAllData = JSON.parse(JSON.stringify(userPosts))
  // set profiles
  for (const post of postsWithAllData) {
    post.profile = profiles[post.userCid] || {}
  }
  // set parent posts
  for (const post of postsWithAllData) {
    post.parentPost = posts[post.parentPostCid]
    if (post.parentPost) {
      post.parentPost.profile = profiles[post.parentPost.userCid] || {}
    }
  }
  // set quoted posts
  for (const post of postsWithAllData) {
    post.quotedPost = posts[post.quotedPostCid]
    if (post.quotedPost) {
      post.quotedPost.profile = profiles[post.quotedPost.userCid] || {}
    }
  }

  debug({userPosts, postsWithAllData, postCount, posts, hasMore})

  return {posts: postsWithAllData, next, hasMore, reset}
}

const getUserCidsFromPosts = (posts) => {
  const userCids = new Set()
  for (const postCid in posts) {
    if (posts[postCid] && posts[postCid].userCid) {
      userCids.add(posts[postCid].userCid)
    }
  }
  return [...userCids]
}

export default useUserPosts
