import assert from 'assert'
import serialize from '../utils/serialize'
import Debug from 'debug'
const debug = Debug('sav3:sav3-ipfs:api:profile')

async function setUserProfile ({displayName, description, thumbnailUrl, bannerUrl} = {}) {
  await this.waitForReady()
  const profile = {}

  if (displayName) {
    assert(typeof displayName === 'string', 'display name not a string')
    assert(displayName.length <= 50, `display name '${displayName}' longer than 50 chars`)
    profile.diplayNameCid = (await this.ipfs.add(displayName)).cid.toString()
  }
  if (description) {
    assert(typeof description === 'string', 'description not a string')
    assert(description.length <= 140, `description '${description}' longer than 140 chars`)
    profile.descriptionCid = (await this.ipfs.add(description)).cid.toString()
  }
  if (thumbnailUrl) {
    assert(typeof thumbnailUrl === 'string', 'thumbnail url not a string')
    assert(thumbnailUrl.startsWith('https://'), `thumbnail url '${thumbnailUrl}' does not start with https://`)
    assert(thumbnailUrl.replace(/[#?].*/, '').match(/\.(jpeg|jpg|png|gif|mp4|webm)$/), `thumbnail url '${thumbnailUrl}' does not end with jpeg|jpg|png|gif|mp4|webm`)
    assert(thumbnailUrl.length <= 140, `thumbnail url '${thumbnailUrl}' longer than 140 chars`)
    profile.thumbnailUrlCid = (await this.ipfs.add(thumbnailUrl)).cid.toString()
  }
  if (bannerUrl) {
    assert(typeof bannerUrl === 'string', 'banner url not a string')
    assert(bannerUrl.startsWith('https://'), `banner url '${bannerUrl}' does not start with https://`)
    assert(bannerUrl.replace(/[#?].*/, '').match(/\.(jpeg|jpg|png|gif|mp4|webm)$/), `banner url '${bannerUrl}' does not end with jpeg|jpg|png|gif|mp4|webm`)
    assert(bannerUrl.length <= 140, `banner url '${bannerUrl}' longer than 140 chars`)
    profile.bannerUrlCid = (await this.ipfs.add(bannerUrl)).cid.toString()
  }

  const profileCid = (await this.ipfs.add(serialize.serializeProfile(profile))).cid.toString()

  const ipnsContent = await this.getOwnUserIpnsContent()
  ipnsContent.profileCid = profileCid
  const newIpnsContentCid = (await this.ipfs.add(serialize.serializeUserIpnsContent(ipnsContent))).cid.toString()
  await this.publishIpnsRecord(newIpnsContentCid)
  debug('editProfile', {displayName, description, thumbnailUrl, bannerUrl, ipnsContent, profile, profileCid, newIpnsContentCid})

  return profileCid
}

async function getUserProfile (profileCid) {
  await this.waitForReady()
  assert(typeof profileCid === 'string', `sav3Ipfs.getUserProfile profileCid '${profileCid}' not a string`)
  const profileCids = serialize.deserializeProfile(await this.getIpfsContent(profileCid))
  const profile = {}
  if (profileCids.diplayNameCid) {
    profile.displayName = await this.getIpfsContent(profileCids.diplayNameCid)
  }
  if (profileCids.descriptionCid) {
    profile.description = await this.getIpfsContent(profileCids.descriptionCid)
  }
  if (profileCids.thumbnailUrlCid) {
    profile.thumbnailUrl = await this.getIpfsContent(profileCids.thumbnailUrlCid)
  }
  if (profileCids.bannerUrlCid) {
    profile.bannerUrl = await this.getIpfsContent(profileCids.bannerUrlCid)
  }

  debug('getUserProfile', {profileCid, profileCids, profile})
  return profile
}

export default {
  setUserProfile,
  getUserProfile
}
