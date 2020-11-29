import puppeteer from 'puppeteer'

class Browser {
  async open () {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
  }

  async close () {
    await this.browser.close()
  }

  gotoHome () {
    return this.page.goto('http://localhost:3000')
  }
}

export default new Browser()
