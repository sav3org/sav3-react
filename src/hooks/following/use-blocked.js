import {useContext} from 'react'
import {FollowingContext} from './following-provider'

const useBlocked = () => {
  const {blocked, setAllBlocked} = useContext(FollowingContext)
  const _blocked = Object.keys(blocked).filter((userCid) => !!blocked[userCid])
  return [_blocked, setAllBlocked]
}

export default useBlocked
