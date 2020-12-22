import {createContext, useState, useEffect} from 'react'
import followManager from 'src/lib/follow-manager'
import assert from 'assert'

export const FollowingContext = createContext()

const FollowingProvider = (props) => {
  // get initial following/blocked cids from cache
  const [following, setFollowing] = useState({})
  const [blocked, setBlocked] = useState({})
  useEffect(() => {
    ;(async () => {
      const following = await followManager.getAllFollowing()
      const blocked = await followManager.getAllBlocked()
      const followingObject = {}
      for (const userCid of following) {
        followingObject[userCid] = true
      }
      setFollowing(followingObject)
      const blockedObject = {}
      for (const userCid of blocked) {
        blockedObject[userCid] = true
      }
      setBlocked(blockedObject)
    })()
  }, [])

  const addFollowing = (userCid) => {
    assert(typeof userCid === 'string', `FollowingProvider.addFollowing invalid userCid '${userCid}'`)
    followManager.addFollowing(userCid)
    setFollowing((prevFollowing) => ({
      ...prevFollowing,
      [userCid]: true
    }))
  }

  const deleteFollowing = (userCid) => {
    assert(typeof userCid === 'string', `FollowingProvider.deleteFollowing invalid userCid '${userCid}'`)
    followManager.deleteFollowing(userCid)
    setFollowing((prevFollowing) => ({
      ...prevFollowing,
      [userCid]: false
    }))
  }

  const setAllFollowing = (userCids) => {
    assert(Array.isArray(userCids), `FollowingProvider.setAllFollowing invalid userCids '${userCids}'`)
    followManager.setAllFollowing(userCids)
    const userCidsObject = {}
    for (const userCid of userCids) {
      userCidsObject[userCid] = true
    }
    setFollowing(userCidsObject)
  }

  const addBlocked = (userCid) => {
    assert(typeof userCid === 'string', `FollowingProvider.addBlocked invalid userCid '${userCid}'`)
    followManager.addBlocked(userCid)
    setBlocked((prevBlocked) => ({
      ...prevBlocked,
      [userCid]: true
    }))
  }

  const deleteBlocked = (userCid) => {
    assert(typeof userCid === 'string', `FollowingProvider.deleteBlocked invalid userCid '${userCid}'`)
    followManager.deleteBlocked(userCid)
    setBlocked((prevBlocked) => ({
      ...prevBlocked,
      [userCid]: false
    }))
  }

  const setAllBlocked = (userCids) => {
    assert(Array.isArray(userCids), `FollowingProvider.setAllBlocked invalid userCids '${userCids}'`)
    followManager.setAllBlocked(userCids)
    const userCidsObject = {}
    for (const userCid of userCids) {
      userCidsObject[userCid] = true
    }
    setBlocked(userCidsObject)
  }

  const contextValue = {
    following,
    addFollowing,
    deleteFollowing,
    setAllFollowing,
    blocked,
    addBlocked,
    deleteBlocked,
    setAllBlocked
  }

  const {children} = props
  return <FollowingContext.Provider value={contextValue}>{children}</FollowingContext.Provider>
}

export default FollowingProvider
