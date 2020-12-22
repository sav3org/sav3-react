import {useContext} from 'react'
import {FollowingContext} from './following-provider'

const useFollowing = () => {
  const {following, setAllFollowing} = useContext(FollowingContext)
  const _following = Object.keys(following).filter((userCid) => !!following[userCid])
  return [_following, setAllFollowing]
}

export default useFollowing
