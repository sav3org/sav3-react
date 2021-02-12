import {createContext} from 'react'
import useFollowing from 'src/hooks/following/use-following'
import useBootstrapUsersCids from 'src/hooks/following/use-bootstrap-users-cids'
import useBootstrapBlacklistedUsersCids from 'src/hooks/following/use-bootstrap-blacklisted-users-cids'
import useOwnUserCid from 'src/hooks/use-own-user-cid'
import useUsersFollowing from 'src/hooks/user/use-users-following'
import useUsersPostCids from 'src/hooks/user/use-users-post-cids'
import useUsersProfiles from 'src/hooks/user/use-users-profiles'
import usePosts from 'src/hooks/post/use-posts'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('sav3:hooks:feed:feed-provider')

export const FeedContext = createContext()

const FeedProvider = (props) => {
  const ownCid = useOwnUserCid()
  const [followingCids] = useFollowing()
  const followingOfFollowingCids = useUsersFollowing(followingCids)

  // bootstrap users
  const bootstrapUsersCids = useBootstrapUsersCids()
  const bootstrapBlacklistedUsersCids = useBootstrapBlacklistedUsersCids()
  // remove blacklisted, and don't get following of following twice for followingCids
  const bootstrapUsersCidsWithoutFollowingAndBlacklistedCids = filterArrayByArray(bootstrapUsersCids, [...followingCids, ...bootstrapBlacklistedUsersCids])
  const bootstrapFollowingOfFollowingCids = useUsersFollowing(bootstrapUsersCidsWithoutFollowingAndBlacklistedCids)
  // remove blacklisted from following of following
  const bootstrapFollowingOfFollowingWithoutBlacklistedCids = filterArrayByArray(bootstrapFollowingOfFollowingCids, bootstrapBlacklistedUsersCids)

  const uniqueUserCids = new Set([...followingCids, ...followingOfFollowingCids, ...bootstrapUsersCidsWithoutFollowingAndBlacklistedCids, ...bootstrapFollowingOfFollowingWithoutBlacklistedCids])
  if (ownCid) {
    uniqueUserCids.add(ownCid)
  }
  const userCids = [...uniqueUserCids]
  const usersPostCids = useUsersPostCids(userCids)

  const feedPostCids = getFeedCids(usersPostCids, followingCids)
  const homePostCids = getFeedCids(usersPostCids, userCids)

  const postCids = getPostCidsFromUsersPostCids(usersPostCids)
  const posts = usePosts(postCids)

  const postsUserCids = getUserCidsFromPosts(posts)
  const userCidsThatNeedProfiles = [...new Set([...userCids, ...postsUserCids])]
  const profiles = useUsersProfiles(userCidsThatNeedProfiles)

  debug({
    ownCid,
    bootstrapUsersCids,
    bootstrapBlacklistedUsersCids,
    followingCids,
    bootstrapUsersCidsWithoutFollowingAndBlacklistedCids,
    bootstrapFollowingOfFollowingWithoutBlacklistedCids,
    followingOfFollowingCids,
    usersPostCids,
    posts,
    profiles,
    feedPostCids,
    homePostCids
  })

  const contextValue = {
    posts,
    profiles,
    feedPostCids,
    homePostCids
  }

  const {children} = props
  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
}

const getPostCidsFromUsersPostCids = (usersPostCids) => {
  const postCids = new Set()
  for (const userCid in usersPostCids) {
    for (const postCid of usersPostCids[userCid]) {
      assert(postCid && typeof postCid === 'string', `FeedProvider invalid postCid '${postCid}' in '${JSON.stringify(usersPostCids)}'`)
      postCids.add(postCid)
    }
  }
  return [...postCids]
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

const filterArrayByArray = (array1, array2) => {
  assert(Array.isArray(array1), 'FeedProvider filterArrayByArray array1 not array')
  assert(Array.isArray(array2), 'FeedProvider filterArrayByArray array2 not array')
  const array2Set = new Set(array2)
  const filteredArray = []
  for (const item of array1) {
    if (array2Set.has(item)) {
      continue
    }
    filteredArray.push(item)
  }
  return filteredArray
}

export default FeedProvider
