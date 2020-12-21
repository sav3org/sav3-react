import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsData from 'src/hooks/use-users-ipns-data'
import useUsersProfiles from 'src/hooks/use-users-profiles'

const useUsersPosts = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUsersPosts = []
  const [usersPosts, setUsersPosts] = useState(defaultUsersPosts)
  const usersIpnsData = useUsersIpnsData(userCids)
  const profiles = useUsersProfiles(userCids)
  const lastPostCids = []
  for (const userCid in usersIpnsData) {
    lastPostCids.push(usersIpnsData[userCid].lastPostCid)
  }

  console.log('useUsersPosts', {usersIpnsData, userCids, lastPostCids, usersPosts})

  useEffect(() => {
    if (!lastPostCids.length) {
      return
    }
    for (const [i, lastPostCid] of lastPostCids.entries()) {
      if (!lastPostCid || typeof lastPostCid !== 'string') {
        // user hasn't posted yet
        continue
      }

      const userCid = userCids[i]
      sav3Ipfs.getUserPostsFromLastPostCid(lastPostCid).then((userPosts) => {
        const posts = {}
        for (const userPost of userPosts) {
          userPost.profile = profiles[userCid] || {}
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
