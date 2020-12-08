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

  afterAll(() => {
    browser.close()
  })
})
