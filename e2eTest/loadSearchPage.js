const getBaseHost = require("./helpers/getBaseHost").default;

describe("Pluto Search Page", function() {
  it("should render search result", function(browser) {
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);

    var targetUrl = `${getBaseHost()}/search?query=paper&filter=year%3D%3A%2Cif%3D%3A%2Cfos%3D%2Cjournal%3D&page=1&cacheExpire=${rationalNumber}`;

    browser
      .url(targetUrl)
      .saveScreenshot("./output/e2e/searchPage/beforesearchPageInitialLoad.png")
      .waitForElementVisible("body", 10000)
      .saveScreenshot("./output/e2e/searchPage/searchPageInitialLoad.png")
      .expect.element("[class^='articleSearch__articleSearchContainer']")
      .to.be.present.before(30000);

    browser.expect.element("[class^='filterContainer__filterItem']").to.be.present;
    browser.expect.element("[class^='header__headerContainer']").to.be.present;
    browser.expect.element("[class^='searchItem__titleWrapper']").to.be.present;
    browser.expect.element("[class^='publishInfoList__publishInfoList']").to.be.present;
    browser.expect.element("[class^='abstract__abstract']").to.be.present;
    browser.expect.element("[class^='keywords__keywords']").to.be.present;
    browser.expect.element("[class^='commentInput__textAreaWrapper']").to.be.present;
  });
});
