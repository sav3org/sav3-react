import {useContext, useCallback} from 'react'
import {FollowingContext} from './following-provider'
import assert from 'assert'

const useIsFollowing = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `useIsFollowing invalid userCid '${userCid}'`)
  const {following, addFollowing, deleteFollowing} = useContext(FollowingContext)
  const isFollowing = !!following[userCid]

  const setIsFollowing = useCallback(
    (value) => {
      if (!userCid) {
        return
      }
      assert(typeof value === 'boolean', `setIsFollowing invalid value '${value}' not a boolean`)
      if (value === true) {
        addFollowing(userCid)
      }
      if (value === false) {
        deleteFollowing(userCid)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userCid]
  )

  if (!userCid) {
    return [undefined, setIsFollowing]
  }
  return [isFollowing, setIsFollowing]
}

export default useIsFollowing
