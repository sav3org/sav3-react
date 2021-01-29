import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsContents from 'src/hooks/user/use-users-ipns-contents'
import useUsersProfiles from 'src/hooks/user/use-users-profiles'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-users-posts')

// don't use this hook it's synchronous and slow
// currently used for the temporary connected peers posts page

const useUsersPosts = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUsersPosts = []
  const [usersPosts, setUsersPosts] = useState(defaultUsersPosts)
  const usersIpnsContents = useUsersIpnsContents(userCids)
  const profiles = useUsersProfiles(userCids)
  const lastPostCids = []
  for (const userCid in usersIpnsContents) {
    lastPostCids.push(usersIpnsContents[userCid].lastPostCid)
  }

  debug({usersIpnsContents, userCids, lastPostCids, usersPosts, profiles})

  useEffect(() => {
    if (!lastPostCids.length) {
      if (usersPosts.length) {
        setUsersPosts([])
      }
      return
    }
    for (const lastPostCid of lastPostCids) {
      if (!lastPostCid || typeof lastPostCid !== 'string') {
        // user hasn't posted yet
        continue
      }

      sav3Ipfs.getUserPostsFromLastPostCid(lastPostCid).then((userPosts) => {
        const posts = {}
        for (const userPost of userPosts) {
          userPost.profile = profiles[userPost.userCid] || {}
          posts[userPost.cid] = userPost
        }

        setUsersPosts((previousUsersPosts) => ({
          ...previousUsersPosts,
          ...posts
        }))
      })
    }
  }, [JSON.stringify(lastPostCids), JSON.stringify(profiles)])

  return usersPosts
}

export default useUsersPosts
