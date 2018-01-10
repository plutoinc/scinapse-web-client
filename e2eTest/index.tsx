import MainPageTester from "./mainPageTester";
import SearchResultTester from "./searchResultTester";
import SearchTester from "./searchTester";

export interface E2ETestManager {
  test: () => Promise<void>;
}

class E2EManager {
  public async test() {
    await MainPageTester.test();
    await SearchResultTester.test();
    await SearchTester.test();
  }
}

const e2eManager = new E2EManager();

e2eManager.test();
