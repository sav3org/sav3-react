import * as localForage from 'localforage'
import assert from 'assert'
import sav3Ipfs from 'src/lib/sav3-ipfs'

class FollowManager {
  constructor () {
    this.followingCache = localForage.createInstance({
      name: 'followingCache'
    })
    this.blockedCache = localForage.createInstance({
      name: 'blockedCache'
    })
  }

  async addFollowing (userCid) {
    assert(typeof userCid === 'string', `FollowManager.addFollowing invalid userCid '${userCid}'`)
    await this.deleteBlocked(userCid)
    await this.followingCache.setItem(userCid, true)
    sav3Ipfs.setFollowing(await this.getAllFollowing())
  }

  async isFollowing (userCid) {
    assert(typeof userCid === 'string', `FollowManager.isFollowing invalid userCid '${userCid}'`)
    const res = await this.followingCache.getItem(userCid)
    return !!res
  }

  async deleteFollowing (userCid) {
    assert(typeof userCid === 'string', `FollowManager.deleteFollowing invalid userCid '${userCid}'`)
    await this.followingCache.removeItem(userCid)
    sav3Ipfs.setFollowing(await this.getAllFollowing())
  }

  getAllFollowing () {
    return this.followingCache.keys()
  }

  async setAllFollowing (userCids) {
    assert(Array.isArray(userCids), `FollowManager.setAllFollowing invalid userCids '${userCids}'`)
    await this.followingCache.clear()
    for (const userCid of userCids) {
      await this.addFollowing(userCid)
    }
    sav3Ipfs.setFollowing(await this.getAllFollowing())
  }

  async addBlocked (userCid) {
    assert(typeof userCid === 'string', `FollowManager.addBlocked invalid userCid '${userCid}'`)
    await this.deleteFollowing(userCid)
    await this.blockedCache.setItem(userCid, true)
  }

  async isBlocked (userCid) {
    assert(typeof userCid === 'string', `FollowManager.isBlocked invalid userCid '${userCid}'`)
    const res = await this.blockedCache.getItem(userCid)
    return !!res
  }

  async deleteBlocked (userCid) {
    assert(typeof userCid === 'string', `FollowManager.deleteBlocked invalid userCid '${userCid}'`)
    await this.blockedCache.removeItem(userCid)
  }

  getAllBlocked () {
    return this.blockedCache.keys()
  }

  async setAllBlocked (userCids) {
    assert(Array.isArray(userCids), `FollowManager.setAllBlocked invalid userCids '${userCids}'`)
    await this.blockedCache.clear()
    for (const userCid of userCids) {
      await this.addBlocked(userCid)
    }
  }
}

// export a singleton to be used throughout the app
const followManager = new FollowManager()
export default followManager

// for testing
window.followManager = followManager
