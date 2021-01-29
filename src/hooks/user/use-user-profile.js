import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUserIpnsContent from 'src/hooks/user/use-user-ipns-content'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-user-profile')

const useUserProfile = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `invalid userCid '${JSON.stringify(userCid)}'`)
  const defaultUserProfile = {}
  const [userProfile, setUserProfile] = useState(defaultUserProfile)
  const userIpnsContent = useUserIpnsContent(userCid)
  const profileCid = userIpnsContent && userIpnsContent.profileCid
  debug({userIpnsContent, userCid, profileCid, userProfile})

  useEffect(() => {
    // set profile to default on profile change
    if (JSON.stringify(userProfile) !== JSON.stringify(defaultUserProfile)) {
      setUserProfile(defaultUserProfile)
    }
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
