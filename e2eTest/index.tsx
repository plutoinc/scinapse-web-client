import MainPageTester from "./mainPageTester";
import SearchResultTester from "./searchResultTester";
import SearchTester from "./searchTester";
import PuppeteerManager from "./puppeteerManager/index";

export interface E2ETestManager {
  test: () => Promise<void>;
}

class E2EManager {
  private testerSet: PuppeteerManager[];

  private printResult() {
    const testCounter = this.testerSet.length;
    console.log("========================================================");
    console.log(`The ${testCounter} number of the E2E test are passed!`);
  }

  public async test() {
    this.testerSet = [MainPageTester, SearchResultTester, SearchTester];

    await Promise.all(this.testerSet.map(tester => tester.test()));

    this.printResult();
  }
}

const e2eManager = new E2EManager();

e2eManager.test();
