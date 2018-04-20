const getBaseURI = require("../getBaseURI").default;

describe("Pluto Search Feature works", function() {
  before(function(browser, done) {
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);
    var targetUrl = `${getBaseURI()}/search?query=paper&filter=year%3D%3A%2Cif%3D%3A%2Cfos%3D%2Cjournal%3D&page=1&cacheExpire=${rationalNumber}`;

    browser
      .url(targetUrl)
      .resizeWindow(1920, 1080)
      .pause(10000)
      .waitForElementPresent("[class^='header__signInButton']", 5000, () => {
        browser.click("[class^='header__signInButton']", () => {
          browser.pause(3000, () => {
            browser.saveScreenshot("./output/e2e/afterClickSignInButton.png");
            browser.waitForElementPresent("[placeholder='E-mail']", 10000, () => {
              browser
                .setValue("[placeholder='E-mail']", [process.env.PLUTO_TEST_ID])
                .setValue("[placeholder='Password']", [process.env.PLUTO_TEST_PASSWORD, browser.Keys.ENTER])
                .waitForElementPresent("[class^='header__userDropdownChar']", 5000, () => {
                  browser.waitForElementPresent("[class^='filterContainer__filterItem']", 5000, () => {
                    browser.saveScreenshot("./output/e2e/afterLogin.png");
                    done();
                  });
                });
            });
          });
        });
      });
  });

  it("should render search result", function(browser) {
    browser.expect.element("[class^='filterContainer__filterItem']").to.be.present;
    browser.expect.element("[class^='header__headerContainer']").to.be.present;
    browser.expect.element("[class^='searchItem__titleWrapper']").to.be.present;
    browser.expect.element("[class^='publishInfoList__publishInfoList']").to.be.present;
    browser.expect.element("[class^='abstract__abstract']").to.be.present;
    browser.expect.element("[class^='keywords__keywords']").to.be.present;
    browser.expect.element("[class^='commentInput__textAreaWrapper']").to.be.present;
  });
});
