import {createContext, useState, useEffect} from 'react'
import usePrevious from 'src/hooks/utils/use-previous'
import useFollowing from 'src/hooks/following/use-following'
import useBootstrapUsersCids from 'src/hooks/following/use-bootstrap-users-cids'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import useUsersFollowing from 'src/hooks/use-users-following'
import useUsersPostCids from 'src/hooks/use-users-post-cids'
import useUsersProfiles from 'src/hooks/use-users-profiles'
import useParentPostsWithProfiles from 'src/hooks/use-parent-posts-with-profiles'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:feed-provider')

export const FeedContext = createContext()

const FeedProvider = (props) => {
  // set posts once on load, and refresh every 5min
  const [posts, setPosts] = useState({})
  const parentPosts = useParentPostsWithProfiles(posts)

  const ownCid = useOwnUserCid()
  const [followingCids] = useFollowing()
  const bootstrapUsersCids = useBootstrapUsersCids()
  const followingOfFollowingCids = useUsersFollowing([...followingCids, ...bootstrapUsersCids])

  const uniqueUserCids = new Set([...followingCids, ...bootstrapUsersCids, ...followingOfFollowingCids])
  if (ownCid) {
    uniqueUserCids.add(ownCid)
  }
  const userCids = [...uniqueUserCids]
  const usersPostCids = useUsersPostCids(userCids)
  const uniquePostCids = usersPostCidsToUniquePostCids(usersPostCids)
  const previousUniquePostCids = usePrevious(uniquePostCids)
  const usersPostCidsString = JSON.stringify(usersPostCids)
  const profiles = useUsersProfiles(userCids)

  const feedPostCids = getFeedCids(usersPostCids, followingCids)
  const homePostCids = getFeedCids(usersPostCids, userCids)

  const getAndSetPost = async (postCid) => {
    const post = await sav3Ipfs.getPost(postCid)
    setPosts((previousPosts) => ({
      ...previousPosts,
      [postCid]: post
    }))
  }

  // get users posts
  useEffect(() => {
    for (const userCid in usersPostCids) {
      for (const postCid of usersPostCids[userCid]) {
        if (!previousUniquePostCids || !previousUniquePostCids.has(postCid)) {
          getAndSetPost(postCid)
        }
      }
    }
  }, [usersPostCidsString])

  debug({ownCid, followingCids, bootstrapUsersCids, followingOfFollowingCids, usersPostCids, posts, profiles, feedPostCids, homePostCids, parentPosts})

  const contextValue = {
    parentPosts,
    posts,
    profiles,
    feedPostCids,
    homePostCids
  }

  const {children} = props
  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
}

const getPostsWithParentPosts = (posts, parentPosts) => {
  const postsWithParentPosts = JSON.parse(JSON.stringify(posts))
  for (const postCid in postsWithParentPosts) {
    postsWithParentPosts[postCid].parentPost = parentPosts[postsWithParentPosts[postCid].parentPostCid]
  }
  return postsWithParentPosts
}

const getFeedCids = (usersPostCids, userCids) => {
  const feedCids = []
  for (const userCid of userCids) {
    if (!usersPostCids[userCid]) {
      continue
    }
    for (const postCid of usersPostCids[userCid]) {
      feedCids.push(postCid)
    }
  }
  return feedCids
}

const usersPostCidsToUniquePostCids = (usersPostCids) => {
  const uniquePostCids = new Set()
  for (const userCid in usersPostCids) {
    for (const postCid of usersPostCids[userCid]) {
      uniquePostCids.add(postCid)
    }
  }
  return uniquePostCids
}

export default FeedProvider
