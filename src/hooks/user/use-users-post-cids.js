import {useEffect, useState} from 'react'
import usePrevious from 'src/hooks/utils/use-previous'
import sav3Ipfs from 'src/lib/sav3-ipfs'
import assert from 'assert'
import useUsersIpnsContents from 'src/hooks/user/use-users-ipns-contents'
import Debug from 'debug'
const debug = Debug('sav3:hooks:use-users-post-cids')

const useUsersPostCids = (userCids) => {
  assert(Array.isArray(userCids), `invalid userCids '${JSON.stringify(userCids)}'`)
  const usersIpnsContents = useUsersIpnsContents(userCids)

  const uniqueUserCids = new Set(userCids)
  const [usersPostCids, setUsersPostCids] = useState(getDefaultUsersPostCids(userCids))
  const previousUsersIpnsContents = usePrevious(usersIpnsContents)

  debug({userCids, usersIpnsContents, previousUsersIpnsContents, usersPostCids})

  // if remount, delete removed user cids, and set new empty user post cids
  const updatePostCids = () => {
    const newEmptyPostCids = []
    const removedPostCids = []

    // find new empty user post cids
    for (const userCid of userCids) {
      if (!usersPostCids[userCid]) {
        newEmptyPostCids.push(userCid)
      }
    }

    // find removed user cids
    for (const userCid in usersPostCids) {
      if (!uniqueUserCids.has(userCid)) {
        removedPostCids.push(userCid)
      }
    }

    // if found any updates, set them
    if (newEmptyPostCids.length || removedPostCids.length) {
      setUsersPostCids((previousUsersPostCids) => {
        const newUsersPostCids = {...previousUsersPostCids}
        for (const missingDefaultIpnsContent of newEmptyPostCids) {
          if (!newUsersPostCids[missingDefaultIpnsContent]) {
            newUsersPostCids[missingDefaultIpnsContent] = []
          }
        }
        for (const removedIpnsContent of removedPostCids) {
          delete newUsersPostCids[removedIpnsContent]
        }
        return newUsersPostCids
      })
    }
  }

  useEffect(() => {
    updatePostCids()

    for (const userCid in usersIpnsContents) {
      const lastPostCid = usersIpnsContents[userCid] && usersIpnsContents[userCid].lastPostCid
      const previousLastPostCid = previousUsersIpnsContents && previousUsersIpnsContents[userCid] && previousUsersIpnsContents[userCid].lastPostCid
      // user hasn't posted yet, or his last post hasn't changed
      if (!lastPostCid || lastPostCid === previousLastPostCid) {
        continue
      }

      let limit = 20

      ;(async () => {
        for await (const postCid of sav3Ipfs.getPreviousPostCids(lastPostCid)) {
          // note: don't stop on unmount or it will cut off new post cids from

          // if lastPostCid changes and triggers refresh somehow (should not happen)
          if (usersPostCids[userCid].includes(postCid)) {
            continue
          }

          setUsersPostCids((previousUsersPostCids) => {
            previousUsersPostCids = JSON.parse(JSON.stringify(previousUsersPostCids))
            previousUsersPostCids[userCid] = [...previousUsersPostCids[userCid], postCid]
            return previousUsersPostCids
          })

          if (!limit--) {
            return
          }
        }
      })()
    }
  }, [JSON.stringify(usersIpnsContents)])

  return usersPostCids
}

const getDefaultUsersPostCids = (userCids) => {
  const defaultUsersPostCids = {}
  for (const userCid of userCids) {
    defaultUsersPostCids[userCid] = []
  }
  return defaultUsersPostCids
}

export default useUsersPostCids
