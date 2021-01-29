import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsContent from 'src/hooks/user/use-user-ipns-content'
import usePrevious from 'src/hooks/utils/use-previous'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-user-post-cids')

const useUserPostCids = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const userIpnsContent = useUserIpnsContent(userCid)
  const lastPostCid = userIpnsContent && userIpnsContent.lastPostCid

  const [userPostCids, setUserPostCids] = useState([])

  debug({userIpnsContent, lastPostCid, userPostCids})

  const previousUserCid = usePrevious(userCid)
  const userCidChanged = previousUserCid && previousUserCid !== userCid

  useEffect(() => {
    if (!lastPostCid || userCidChanged) {
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
  }, [lastPostCid, userCid])

  return userPostCids
}

export default useUserPostCids
