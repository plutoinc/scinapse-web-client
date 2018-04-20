const getBaseURI = require("../getBaseURI").default;

describe("Pluto search page features along with auth user", function() {
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
            browser.waitForElementPresent("[placeholder='E-mail']", 5000, () => {
              browser
                .setValue("[placeholder='E-mail']", [process.env.PLUTO_TEST_ID])
                .setValue("[placeholder='Password']", [process.env.PLUTO_TEST_PASSWORD, browser.Keys.ENTER])
                .saveScreenshot("./output/e2e/withAuth/searchPage/beforeLogin.png")
                .waitForElementPresent("[class^='header__userDropdownChar']", 10000, () => {
                  browser.waitForElementPresent("[class^='filterContainer__filterItem']", 5000, () => {
                    browser.saveScreenshot("./output/e2e/withAuth/searchPage/afterLogin.png", () => {
                      done();
                    });
                  });
                });
            });
          });
        });
      });
  });

  after(function(browser, done) {
    browser.click("[class^='header__userDropdownChar']", () => {
      browser.waitForElementPresent("[class^='header__signOutButton']", 5000, () => {
        browser.click("[class^='header__signOutButton']", () => {
          browser.pause(10000, () => {
            browser.acceptAlert(() => {
              browser.waitForElementPresent("[class^='header__signInButton']", 5000, () => {
                browser.saveScreenshot("./output/e2e/withAuth/searchPage/afterLogout.png", () => {
                  done();
                });
              });
            });
          });
        });
      });
    });
  });

  describe("when the user auth existence doesn't matter", () => {
    it("should render search result", browser => {
      browser.expect.element("[class^='filterContainer__filterItem']").to.be.present;
      browser.expect.element("[class^='header__headerContainer']").to.be.present;
      browser.expect.element("[class^='searchItem__titleWrapper']").to.be.present;
      browser.expect.element("[class^='publishInfoList__publishInfoList']").to.be.present;
      browser.expect.element("[class^='abstract__abstract']").to.be.present;
      browser.expect.element("[class^='keywords__keywords']").to.be.present;
      browser.expect.element("[class^='commentInput__textAreaWrapper']").to.be.present;
    });
  });

  describe("when the user isn't email verified user", () => {
    describe("when click the bookmark button", () => {
      after((browser, done) => {
        browser.keys([browser.Keys.ESCAPE], () => {
          browser.saveScreenshot("./output/e2e/withAuth/searchPage/afterTurnOffVerificationDialog.png", () => {
            done();
          });
        });
      });

      it("should render e-mail verification dialog", browser => {
        browser.click("[class^='infoList__bookmarkButton']", () => {
          browser.waitForElementPresent("[class^='verificationNeeded__verificationNeededContainer']", 5000, () => {
            browser.expect.element("[class^='verificationNeeded__verificationNeededContainer']").to.be.present;
          });
        });
      });
    });
  });
});
