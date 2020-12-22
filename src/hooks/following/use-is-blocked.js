import {useContext, useCallback} from 'react'
import {FollowingContext} from './following-provider'
import assert from 'assert'

const useIsBlocked = (userCid) => {
  assert(!userCid || typeof userCid === 'string', `useIsBlocked invalid userCid '${userCid}'`)
  const {blocked, addBlocked, deleteBlocked} = useContext(FollowingContext)
  const isBlocked = !!blocked[userCid]

  const setIsBlocked = useCallback(
    (value) => {
      if (!userCid) {
        return
      }
      assert(typeof value === 'boolean', `setIsBlocked invalid value '${value}' not a boolean`)
      if (value === true) {
        addBlocked(userCid)
      }
      if (value === false) {
        deleteBlocked(userCid)
      }
    },
    [userCid]
  )

  if (!userCid) {
    return [undefined, setIsBlocked]
  }
  return [isBlocked, setIsBlocked]
}

export default useIsBlocked
