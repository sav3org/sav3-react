import {useState, useEffect} from 'react'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'

const usersFollowingCache = {}

const useUsersFollowing = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  // remove duplicates
  const uniqueUserCids = new Set(userCids)
  const userCidsString = JSON.stringify([...uniqueUserCids])
  const [usersFollowing, setUsersFollowing] = useState([])

  console.log('useUsersFollowing', {userCids, usersFollowing})

  useEffect(() => {
    for (const userCid of uniqueUserCids) {
      const userFollowing = usersFollowingCache[userCid]
      if (userFollowing) {
        setUsersFollowing((previousUsersFollowing) => addNewUsersFollowing(previousUsersFollowing, userFollowing))
      }
      else {
        sav3Ipfs.getUserFollowing(userCid).then((userFollowing) => {
          usersFollowingCache[userCid] = userFollowing
          setUsersFollowing((previousUsersFollowing) => addNewUsersFollowing(previousUsersFollowing, userFollowing))
        })
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCidsString])

  return usersFollowing
}

const addNewUsersFollowing = (previousUsersFollowing, newUsersFollowing) => {
  previousUsersFollowing = new Set(previousUsersFollowing)
  for (const userCid of newUsersFollowing) {
    previousUsersFollowing.add(userCid)
  }
  return [...previousUsersFollowing]
}

export default useUsersFollowing
