import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsData from 'src/hooks/use-user-ipns-data'

const useUserPosts = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const defaultPeerPosts = []
  const [peerPosts, setPeerPosts] = useState(defaultPeerPosts)
  const userIpnsData = useUserIpnsData(userCid)
  const lastPostCid = userIpnsData && userIpnsData.lastPostCid
  console.log('useUserPosts', {userIpnsData, userCid, peerPosts})

  useEffect(() => {
    if (!lastPostCid || typeof lastPostCid !== 'string') {
      return
    }
    ;(async () => {
      const posts = await sav3Ipfs.getUserPostsFromLastPostCid(lastPostCid)
      setPeerPosts(posts)
    })()
  }, [lastPostCid])

  return peerPosts
}

export default useUserPosts
