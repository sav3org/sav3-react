import puppeteer from 'puppeteer'

class Browser {
  async open () {
    this._browser = await puppeteer.launch()
    this.page = await this._browser.newPage()
  }

  async close () {
    await this._browser.close()
  }

  gotoHome () {
    return this.page.goto('http://localhost:3000')
  }
}

export default new Browser()
