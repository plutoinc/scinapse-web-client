import { E2ETestManager } from "..";
import PuppeteerManager from "../puppeteerManager";

class SearchTester extends PuppeteerManager implements E2ETestManager {
  constructor() {
    super();
    this.testDelegate = this.checkMainPage;
  }

  private async searchMockKeyword() {
    console.log("## Start to search");

    const mockKeyword = "papar";
    await this.page.waitForSelector("[placeholder='Search papers'");
    await this.page.click("[placeholder='Search papers'");
    await this.page.keyboard.type(mockKeyword);
    await this.page.keyboard.press("Enter");
  }

  private async checkSearchResult() {
    console.log("## Check the search result");
    await this.page.waitForSelector("[class^='searchItem__searchItemWrapper'", { timeout: 10000 });
  }

  private async checkMainPage() {
    await this.page.goto(`${this.getHost()}`);
    await this.searchMockKeyword();
    await this.checkSearchResult();
  }

  public async test() {
    console.log("# START SEARCH FEATURE E2E TEST");
    super.test();
  }
}

const searchResultTester = new SearchTester();

export default searchResultTester;
