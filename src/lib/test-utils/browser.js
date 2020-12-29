import puppeteer from 'puppeteer'
import util from 'util'
import isDocker from 'is-docker'

class Browser {
  async open () {
    let puppeteerOptions
    if (isDocker()) {
      puppeteerOptions = {executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox']}
    }
    this.browser = await puppeteer.launch(puppeteerOptions)
    this.page = await this.browser.newPage()

    // log browser console logs
    this.page.on('console', (consoleMessage) => {
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
  }

  async close () {
    await this.browser.close()
  }

  gotoHome () {
    return this.page.goto('http://localhost:3000')
  }
}

export default new Browser()
