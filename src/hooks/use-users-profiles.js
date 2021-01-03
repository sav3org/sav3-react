import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsData from 'src/hooks/use-users-ipns-data'

const useUsersProfiles = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUserProfiles = {}
  const [usersProfiles, setUsersProfiles] = useState(defaultUserProfiles)
  const usersIpnsData = useUsersIpnsData(userCids)
  const profileCids = {}
  for (const userCid in usersIpnsData) {
    profileCids[userCid] = usersIpnsData[userCid].profileCid
  }
  console.log('useUsersProfiles', {usersIpnsData, userCids, profileCids, usersProfiles})

  useEffect(() => {
    for (const userCid in profileCids) {
      const profileCid = profileCids[userCid]
      if (!profileCid || typeof profileCid !== 'string') {
        continue
      }

      sav3Ipfs.getUserProfile(profileCid).then((userProfile) => {
        setUsersProfiles((previousUsersProfiles) => ({
          ...previousUsersProfiles,
          [userCid]: userProfile
        }))
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(profileCids)])

  return usersProfiles
}

export default useUsersProfiles
