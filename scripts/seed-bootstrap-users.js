const puppeteer = require('puppeteer')
const util = require('util')
const isDocker = require('is-docker')

;(async () => {
  let puppeteerOptions
  if (isDocker()) {
    puppeteerOptions = {executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox']}
  }

  // default puppeteer args that prevent webrtc from working (puppeteer.defaultArgs() to list all default args)
  const ignoreDefaultArgs = ['--disable-background-networking']
  const browser = await puppeteer.launch({...puppeteerOptions, ignoreDefaultArgs, headless: true})
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
    // .then(() => 
    //   page.evaluate(() => {
    //     localStorage.debug = 'sav3:sav3-ipfs:index'
    //   })
    // )

  // reload the page every 60 seconds
  setInterval(() => page.reload().catch(console.log), 1000 * 60)

  // docker auto restart every 5min to refresh posts and make sure it's still alive
  if (isDocker()) {
    setTimeout(async () => {
      try {
        await browser.close()
      }
      catch (e) {}
      process.exit()
    }, 1000 * 60 * 5)
  }
})()
