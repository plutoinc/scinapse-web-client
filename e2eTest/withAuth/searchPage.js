const getBaseHost = require("../helpers/getBaseHost").default;

describe("Pluto search page features along with auth user", function() {
  before(function(browser, done) {
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);
    var targetUrl = `${getBaseHost()}/search?query=paper&filter=year%3D%3A%2Cif%3D%3A%2Cfos%3D%2Cjournal%3D&page=1&cacheExpire=${rationalNumber}`;

    browser
      .url(targetUrl)
      .resizeWindow(1920, 1080)
      .pause(10000)
      .waitForElementVisible("[class^='header__signInButton']")
      .saveScreenshot(
        "./output/e2e/withAuth/searchPage/before_click_sign_in_button.png"
      )
      .click("[class^='header__signInButton']")
      .saveScreenshot(
        "./output/e2e/withAuth/searchPage/after_click_sign_in_button.png"
      )
      .waitForElementVisible("[placeholder='E-mail']", 5000)
      .setValue("[placeholder='E-mail']", [process.env.PLUTO_TEST_ID])
      .setValue("[placeholder='Password']", [
        process.env.PLUTO_TEST_PASSWORD,
        browser.Keys.ENTER
      ])
      .saveScreenshot(
        "./output/e2e/withAuth/searchPage/after_submit_sign_in_form.png"
      )
      .waitForElementVisible("[class^='header__userDropdownChar']", 20000)
      .waitForElementVisible("[class^='filterContainer__filterItem']", 20000)
      .waitForElementVisible("[class^='title__title']", 30000);
    done();
  });

  describe("with unverified but signed user", () => {
    it("should render search result", browser => {
      browser.expect.element("[class^='filterContainer__filterItem']").to.be
        .present;
      browser.expect.element("[class^='header__headerContainer']").to.be
        .present;
      browser.expect.element("[class^='title__title']").to.be.present;
      browser.expect.element("[class^='publishInfoList__publishInfoList']").to
        .be.present;
      browser.expect.element("[class^='abstract__abstract']").to.be.present;
    });
  });

  describe("when click the bookmark button", () => {
    after((browser, done) => {
      browser.keys([browser.Keys.ESCAPE], () => {
        browser.saveScreenshot(
          "./output/e2e/withAuth/searchPage/after_turn_off_verification_dialog.png",
          () => {
            done();
          }
        );
      });
    });

    it("should render e-mail verification dialog", browser => {
      browser
        .click("[class^='infoList__bookmarkButton']")
        .expect.element(
          "[class^='verificationNeeded__verificationNeededContainer']"
        )
        .to.be.present.before(1000);
    });
  });
});
