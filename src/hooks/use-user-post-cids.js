import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsContent from 'src/hooks/use-user-ipns-content'
import useUsersProfiles from 'src/hooks/use-users-profiles'

const useUserPostCids = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const userIpnsContent = useUserIpnsContent(userCid)
  const lastPostCid = userIpnsContent && userIpnsContent.lastPostCid

  const [userPostCids, setUserPostCids] = useState([])

  console.log('useUserPostCids', {userIpnsContent, lastPostCid, userPostCids})

  useEffect(() => {
    if (!lastPostCid) {
      if (userPostCids.length) {
        setUserPostCids([])
      }
      return
    }

    let limit = 100
    let isMounted = true
    ;(async () => {
      for await (const postCid of sav3Ipfs.getPreviousPostCids(lastPostCid)) {
        if (!isMounted) {
          return
        }

        // if lastPostCid changes and triggers refresh
        if (userPostCids.includes(postCid)) {
          continue
        }

        setUserPostCids((previousUserPostCids) => [...previousUserPostCids, postCid])

        if (!limit--) {
          return
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [lastPostCid])

  return userPostCids
}

export default useUserPostCids
