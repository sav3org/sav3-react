import browser from 'src/lib/test-utils/browser'

// ipns server must be available at ipnsClient.url for this test to work

describe('IpnsClient', () => {
  beforeAll(async () => {
    await browser.open()
    await browser.gotoHome()
    await browser.page.evaluate(async () => {
      const ipfs = await window.Ipfs.create({config: {Bootstrap: []}})
      window.ownPeerCid = (await ipfs.id()).id
      window.ipnsClient = window.IpnsClient({ipfs})
    })
  })

  test('window.IpnsClient and window.Ipfs exist', async () => {
    expect(await browser.page.evaluate(() => typeof window.IpnsClient === 'function')).toBe(true)
    expect(await browser.page.evaluate(() => window.Ipfs && typeof window.Ipfs === 'object')).toBe(true)
  })

  test('IpnsClient subscribe and publish', async () => {
    const ipfsValues = await browser.page.evaluate(() => window.ipnsClient.subscribe([window.ownPeerCid, 'QmQzAu2g4s6XBWnmBQsbmENzrzmQvSHzmKNqQNqok66Zqe']))
    expect(Array.isArray(ipfsValues)).toBe(true)
    expect(ipfsValues.length).toBe(2)

    const res = await browser.page.evaluate(async () => {
      // publish
      const res = await new Promise((resolve) => {
        // once subscribed to own peer cid, should get real time publish updates
        window.ipnsClient.on('publish', (ipnsPath, ipnsValue) => {
          resolve([ipnsPath, ipnsValue])
        })
        window.ipnsClient.publish('QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE71')
      })
      return res
    })
    const ownPeerCid = await await browser.page.evaluate(() => window.ownPeerCid)
    expect(res).toStrictEqual([ownPeerCid, 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE71'])
  })

  afterAll(() => {
    browser.close()
  })
})
