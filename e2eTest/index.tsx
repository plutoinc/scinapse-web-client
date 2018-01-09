import MainPageTester from "./mainPageTester";

export interface E2ETestManager {
  test: () => Promise<void>;
}

class E2EManager {
  public async test() {
    await MainPageTester.test();
    // searchResultPageTest();
    // searchTest();
  }
}

const e2eManager = new E2EManager();

(async () => {
  try {
    await e2eManager.test();
  } catch (err) {
    console.log("============================================");
    console.log("We've got an error on E2E test!");
    console.error(err);
    throw err;
  }
})();
