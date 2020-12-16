import browser from 'src/lib/test-utils/browser'
import isIpfs from 'is-ipfs'

describe('sav3Ipfs', () => {
  beforeAll(async () => {
    await browser.open()
    await browser.gotoHome()
    await browser.page.evaluate(async () => {
      await window.sav3Ipfs.waitForReady()
    })
  })

  test('window.sav3Ipfs exists', async () => {
    expect(await browser.page.evaluate(() => window.sav3Ipfs && typeof window.sav3Ipfs === 'object')).toBe(true)
  })

  test('sav3Ipfs sav3Ipfs.publishPost and sav3Ipfs.getUserPostsFromLastPostCid', async () => {
    const lastPostCid = await browser.page.evaluate(async () => {
      // publish 15 times
      let postCount = 15
      let lastPostCid
      while (--postCount) {
        lastPostCid = await window.sav3Ipfs.publishPost({content: `test ${postCount}`})
      }
      return lastPostCid
    })
    expect(isIpfs.cid(lastPostCid)).toBe(true)

    const posts = await browser.page.evaluate(async (lastPostCid) => {
      const posts = await window.sav3Ipfs.getUserPostsFromLastPostCid(lastPostCid)
      return posts
    }, lastPostCid)
    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(1)
    expect(posts[0].content).toMatch(/^test/)
    expect(typeof posts[0].timestamp).toBe('number')
  })

  test('sav3Ipfs sav3Ipfs.editUserProfile and sav3Ipfs.getUserProfile', async () => {
    const profileCid = await browser.page.evaluate(async () => {
      const profileCid = await window.sav3Ipfs.editUserProfile({
        displayName: 'John J',
        description: 'John J\'s description',
        thumbnailUrl: 'https://i.imgur.com/Jkua4yg.jpeg',
        bannerUrl: 'https://i.imgur.com/DWCOaz9.jpeg'
      })
      return profileCid
    })
    expect(isIpfs.cid(profileCid)).toBe(true)

    const profile = await browser.page.evaluate(async (profileCid) => {
      const profile = await window.sav3Ipfs.getUserProfile(profileCid)
      return profile
    }, profileCid)
    expect(profile && typeof profile === 'object').toBe(true)
    expect(profile.displayName).toBe('John J')
    expect(profile.description).toBe('John J\'s description')
    expect(profile.thumbnailUrl).toBe('https://i.imgur.com/Jkua4yg.jpeg')
    expect(profile.bannerUrl).toBe('https://i.imgur.com/DWCOaz9.jpeg')
  })

  afterAll(() => {
    browser.close()
  })
})
