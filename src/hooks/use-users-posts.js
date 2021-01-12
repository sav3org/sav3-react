import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsContent from 'src/hooks/use-users-ipns-content'
import useUsersProfiles from 'src/hooks/use-users-profiles'

const useUsersPosts = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUsersPosts = []
  const [usersPosts, setUsersPosts] = useState(defaultUsersPosts)
  const usersIpnsContent = useUsersIpnsContent(userCids)
  const profiles = useUsersProfiles(userCids)
  const lastPostCids = []
  for (const userCid in usersIpnsContent) {
    lastPostCids.push(usersIpnsContent[userCid].lastPostCid)
  }

  console.log('useUsersPosts', {usersIpnsContent, userCids, lastPostCids, usersPosts, profiles})

  useEffect(() => {
    if (!lastPostCids.length) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lastPostCids), JSON.stringify(profiles)])

  return usersPosts
}

export default useUsersPosts
