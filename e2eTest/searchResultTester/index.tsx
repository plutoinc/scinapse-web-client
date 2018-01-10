import { E2ETestManager } from "..";
import PuppeteerManager from "../puppeteerManager";

class SearchResultTester extends PuppeteerManager implements E2ETestManager {
  constructor() {
    super();
    this.testDelegate = this.checkMainPage;
  }

  private async checkResultLoaded() {
    console.log("## Check searchResult exist");
    await this.page.waitForSelector("[class^='searchItem__searchItemWrapper'");
  }

  private async checkMainPage() {
    await this.page.goto(`${this.getHost()}/search?query=text%3Dpaper%2Cyear%3D%3A%2Cif%3D%3A&page=1`);
    await this.checkResultLoaded();
  }

  public async test() {
    console.log("# START SEARCH RESULT PAGE E2E TEST");
    await super.test();
  }
}

const searchResultTester = new SearchResultTester();

export default searchResultTester;
