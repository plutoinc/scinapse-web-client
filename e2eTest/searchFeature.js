describe("Pluto Search Features", function() {
  it("should render search result", function(browser) {
    var targetUrl;
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);
    if (process.env.NODE_ENV === "production") {
      targetUrl = `https://scinapse.io?cacheExpire=${rationalNumber}`;
    } else {
      targetUrl = `https://stage.scinapse.io?cacheExpire=${rationalNumber}`;
    }

    browser
      .url(targetUrl)
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(10000);

    browser
      .pause(10000)
      .setValue(
        "[class^='inputBox__searchInputWrapper'] > [placeholder='Search papers by title, author, doi or keyword']",
        ["of"],
        () => {
          browser.saveScreenshot("./output/e2e/searchFeature/beforeEnterSearchKeyword.png", () => {
            browser.click("[class^='inputBox__searchIconWrapper']", () => {
              browser.waitForElementPresent("[class^='articleSearch__articleSearchContainer']", 60000, () => {
                browser.saveScreenshot("./output/e2e/searchFeature/afterEnterSearchKeyword.png", () => {
                  browser.expect.element("[class^='searchItem__titleWrapper']").to.be.present.before(10000);
                });
              });
            });
          });
        },
      );
  });
});
