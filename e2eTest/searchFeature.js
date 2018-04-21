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
        ["of", browser.Keys.ENTER],
      )
      .pause(5000)
      .saveScreenshot("./output/e2e/searchFeature/afterEnterSearchKeyword.png")
      .click("[class^='inputBox__searchIconWrapper']")
      .waitForElementPresent("[class^='articleSearch__articleSearchContainer']", 10000)
      .saveScreenshot("./output/e2e/searchFeature/afterWaitSearchContainer.png")
      .expect.element("[class^='searchItem__titleWrapper']")
      .to.be.present.before(10000);
  });
});
