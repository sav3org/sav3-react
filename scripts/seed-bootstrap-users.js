const puppeteer = require('puppeteer')
const util = require('util')

;(async () => {
  const puppeteerOptions = {executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox']}
  const browser = await puppeteer.launch(puppeteerOptions)
  const page = await browser.newPage()

  // log browser console logs
  page.on('console', (consoleMessage) => {
    let string = ''
    const args = consoleMessage.args()
    for (const [i, arg] of args.entries()) {
      if (arg._remoteObject.preview) {
        string += util.inspect(arg._remoteObject.preview.properties)
      }
      else {
        string += arg._remoteObject.value
      }
      if (i !== args.length) {
        string += ' '
      }
    }
    console.log(string)
  })

  page.goto('https://testnet.sav3.org')

  // reload the page every 60 seconds
  setInterval(() => page.reload().catch(console.log), 1000 * 60)

  // docker auto restart every 5min to refresh posts and make sure it's still alive
  setTimeout(() => {
    try {
      await browser.close()
    }
    catch (e) {}
    process.exit()
  }, 1000 * 60 * 5)
})()
