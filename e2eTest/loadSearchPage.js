const getBaseURI = require("./getBaseURI").default;

describe("Pluto Search Feature works", function() {
  it("should render search result", function(browser) {
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);

    var targetUrl = `${getBaseURI()}/search?query=paper&filter=year%3D%3A%2Cif%3D%3A%2Cfos%3D%2Cjournal%3D&page=1&cacheExpire=${rationalNumber}`;

    browser
      .url(targetUrl)
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
