import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsData from 'src/hooks/use-users-ipns-data'

const useUsersProfiles = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUserProfiles = {}
  const [usersProfiles, setUsersProfiles] = useState(defaultUserProfiles)
  const usersIpnsData = useUsersIpnsData(userCids)
  const profileCids = []
  for (const userCid in usersIpnsData) {
    profileCids.push(usersIpnsData[userCid].profileCid)
  }
  console.log('useUsersProfiles', {usersIpnsData, userCids, profileCids, usersProfiles})

  useEffect(() => {
    if (!profileCids.length) {
      return
    }
    for (const [i, profileCid] of profileCids.entries()) {
      const userCid = userCids[i]
      sav3Ipfs.getUserProfile(profileCid).then((userProfile) => {
        setUsersProfiles((previousUsersProfiles) => ({
          ...previousUsersProfiles,
          [userCid]: userProfile
        }))
      })
    }
  }, [JSON.stringify(profileCids)])

  return usersProfiles
}

export default useUsersProfiles
