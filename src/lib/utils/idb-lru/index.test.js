import browser from 'src/lib/test-utils/browser'

// TODO: fork the unit tests from https://www.npmjs.com/package/hashlru, no clue if it works properly or has performance issues

describe('IdbLru', () => {
  beforeAll(async () => {
    await browser.open()
    await browser.gotoHome()
  })
  test('window.IdbLru exists', async () => {
    expect(await browser.page.evaluate(() => typeof window.IdbLru === 'function')).toBe(true)
  })
  afterAll(() => {
    browser.close()
  })
})
