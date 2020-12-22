import {useEffect, useState} from 'react'
import followManager from 'src/lib/follow-manager'
import assert from 'assert'

const useIsFollowing = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const [following, setFollowing] = useState()

  useEffect(() => {
    if (!userCid) {
      return
    }
    ;(async () => {
      const following = await followManager.isFollowing(userCid)
      setFollowing(following)
    })()
  }, [userCid])

  return following
}

export default useIsFollowing
