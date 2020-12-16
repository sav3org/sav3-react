import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsData from 'src/hooks/use-user-ipns-data'

const useUserProfile = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const defaultUserProfile = {}
  const [userProfile, setUserProfile] = useState(defaultUserProfile)
  const userIpnsData = useUserIpnsData(userCid)
  const profileCid = userIpnsData && userIpnsData.profileCid
  console.log('useUserProfile', {userIpnsData, userCid, profileCid, userProfile})

  useEffect(() => {
    if (!profileCid || typeof profileCid !== 'string') {
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
