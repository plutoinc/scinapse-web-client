import * as puppeteer from "puppeteer";

export default class PuppeteerManager {
  private _browser: puppeteer.Browser;
  private _page: puppeteer.Page;
  protected testDelegate: () => Promise<void>;

  get browser() {
    return this._browser;
  }

  get page() {
    return this._page;
  }

  private async setDefaultViewport() {
    await this.page.setViewport({
      width: 1920,
      height: 1080,
    });
  }

  private async launchBrowser() {
    this._browser = await puppeteer.launch();
    this._page = await this.browser.newPage();
    this.setDefaultViewport();
  }

  protected getHost() {
    if (process.env.NODE_ENV === "stage") {
      return "https://poc.pluto.network";
    } else if (process.env.NODE_ENV === "production") {
      return "https://poc-stage.pluto.network";
    } else {
      throw new Error("You need run E2E test in specifin NODE_ENV");
    }
  }

  public async test() {
    try {
      await this.launchBrowser();
      await this.testDelegate();
    } catch (err) {
      console.error(err);
    } finally {
      await this.browser.close();
    }
  }
}
