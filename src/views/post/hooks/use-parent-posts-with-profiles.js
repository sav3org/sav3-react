import usePosts from 'src/hooks/post/use-posts'
import useUsersProfiles from 'src/hooks/user/use-users-profiles'
import assert from 'assert'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-parent-posts-with-profiles')

// TODO: delete this hook after refactoring the /post/ feed, fetching profiles with posts is a bad design

const useParentPostsWithProfiles = (postsObjectOrArray) => {
  assert(postsObjectOrArray && typeof postsObjectOrArray === 'object', `invalid postsObjectOrArray '${JSON.stringify(postsObjectOrArray)}'`)
  const parentPostCids = getParentPostCids(postsObjectOrArray)
  const parentPosts = usePosts(parentPostCids)
  const userCids = getUserCids(parentPosts)
  const profiles = useUsersProfiles(userCids)
  const parentPostsWithProfiles = {}
  for (const postCid in parentPosts) {
    parentPostsWithProfiles[postCid] = {...parentPosts[postCid]}
    parentPostsWithProfiles[postCid].profile = profiles[parentPostsWithProfiles[postCid].userCid] || {}
  }
  debug({parentPostCids, parentPosts, profiles, userCids, parentPostsWithProfiles, postsObjectOrArray})
  return parentPostsWithProfiles
}

const getParentPostCids = (postsObjectOrArray) => {
  const parentPostCids = new Set()

  if (Array.isArray(postsObjectOrArray)) {
    for (const post of postsObjectOrArray) {
      if (post && post.parentPostCid) {
        parentPostCids.add(post.parentPostCid)
      }
    }
  }
  else {
    for (const postCid in postsObjectOrArray) {
      if (postsObjectOrArray[postCid] && postsObjectOrArray[postCid].parentPostCid) {
        parentPostCids.add(postsObjectOrArray[postCid].parentPostCid)
      }
    }
  }
  return [...parentPostCids]
}

const getUserCids = (parentPosts) => {
  const userCids = new Set()
  for (const postCid in parentPosts) {
    if (parentPosts[postCid] && parentPosts[postCid].userCid) {
      userCids.add(parentPosts[postCid].userCid)
    }
  }
  return [...userCids]
}

export default useParentPostsWithProfiles
