import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsContent from 'src/hooks/use-user-ipns-content'

const useUserProfile = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const defaultUserProfile = {}
  const [userProfile, setUserProfile] = useState(defaultUserProfile)
  const userIpnsContent = useUserIpnsContent(userCid)
  const profileCid = userIpnsContent && userIpnsContent.profileCid
  console.log('useUserProfile', {userIpnsContent, userCid, profileCid, userProfile})

  useEffect(() => {
    if (!profileCid || typeof profileCid !== 'string') {
      if (JSON.stringify(userProfile) !== JSON.stringify(defaultUserProfile)) {
        setUserProfile(defaultUserProfile)
      }
      return
    }
    ;(async () => {
      const userProfile = await sav3Ipfs.getUserProfile(profileCid)
      setUserProfile(userProfile)
    })()
  }, [profileCid])

  return userProfile
}

export default useUserProfile
