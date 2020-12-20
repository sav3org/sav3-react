import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsData from 'src/hooks/use-user-ipns-data'
import useUserProfile from 'src/hooks/use-user-profile'

const useUserPosts = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const defaultUserPosts = []
  const [userPosts, setUserPosts] = useState(defaultUserPosts)
  const userIpnsData = useUserIpnsData(userCid)
  const profile = useUserProfile(userCid)
  const lastPostCid = userIpnsData && userIpnsData.lastPostCid
  console.log('useUserPosts', {userIpnsData, userCid, userPosts})

  useEffect(() => {
    if (!lastPostCid || typeof lastPostCid !== 'string') {
      return
    }
    ;(async () => {
      const posts = await sav3Ipfs.getUserPostsFromLastPostCid(lastPostCid)
      for (const i in posts) {
        posts[i].profile = profile || {}
      }
      setUserPosts(posts)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPostCid, JSON.stringify(profile)])

  return userPosts
}

export default useUserPosts
