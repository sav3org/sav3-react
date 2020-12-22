import {useEffect, useState} from 'react'
import followManager from 'src/lib/follow-manager'

const useFollowingCids = () => {
  const [following, setFollowing] = useState([])

  useEffect(() => {
    ;(async () => {
      const following = await followManager.getAllFollowing()
      setFollowing(following)
    })()
  }, [])

  return following
}

export default useFollowingCids
