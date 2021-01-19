import {useEffect, useState} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsContents from 'src/hooks/use-users-ipns-contents'
import usePrevious from 'src/hooks/utils/use-previous'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-users-profiles')

const useUsersProfiles = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const defaultUserProfiles = {}
  const [usersProfiles, setUsersProfiles] = useState(defaultUserProfiles)
  const usersIpnsContents = useUsersIpnsContents(userCids)
  const profileCids = {}
  for (const userCid in usersIpnsContents) {
    profileCids[userCid] = usersIpnsContents[userCid].profileCid
  }
  const previousProfileCids = usePrevious(profileCids)
  debug({usersIpnsContents, userCids, profileCids, previousProfileCids, usersProfiles})

  const getUserProfileIsPending = (userCid) => {
    return (
      previousProfileCids &&
      previousProfileCids[userCid] &&
      previousProfileCids[userCid].profileCid &&
      profileCids[userCid] &&
      profileCids[userCid].profileCid === previousProfileCids[userCid].profileCid
    )
  }

  useEffect(() => {
    // dont reset to default on profile cids change because
    // even if extra profiles are kept it doesn't affect
    // any functionalities yet

    for (const userCid in profileCids) {
      const profileCid = profileCids[userCid]
      if (!profileCid || typeof profileCid !== 'string') {
        continue
      }
      if (getUserProfileIsPending(userCid)) {
        continue
      }

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
