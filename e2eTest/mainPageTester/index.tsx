import { E2ETestManager } from "..";
import PuppeteerManager from "../puppeteerManager/index";

class MainPageTester extends PuppeteerManager implements E2ETestManager {
  constructor() {
    super();
    this.testDelegate = this.checkMainPage;
  }

  private async checkDocumentTitle() {
    console.log("## Check valid document title");
    const title = await this.page.title();
    if (title !== "Pluto Network") {
      throw new Error("Title Error");
    }
  }

  private async checkHeadlineLoaded() {
    console.log("## Check valid headline");
    await this.page.waitForSelector("[class^='articleSearch__searchTitle'");
  }

  private async checkMainPage() {
    await this.page.goto(`${this.getHost()}/`);
    await this.checkDocumentTitle();
    await this.checkHeadlineLoaded();
  }

  public async test() {
    console.log("# START MAIN PAGE E2E TEST");
    await super.test();
  }
}

const mainPageTester = new MainPageTester();

export default mainPageTester;
