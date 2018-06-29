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
      .pause(10000)
      .saveScreenshot("./output/e2e/searchFeature/after_load_page.png")
      .waitForElementVisible("[class^='inputBox__searchInputWrapper']", 1000)
      .setValue(
        "[class^='inputBox__searchInputWrapper'] > [placeholder='Search papers by title, author, doi or keyword']",
        ["of", browser.Keys.ENTER]
      )
      .saveScreenshot("./output/e2e/searchFeature/after_submit_search_term.png")
      .waitForElementVisible(
        "[class^='articleSearch__articleSearchContainer']",
        10000
      )
      .saveScreenshot(
        "./output/e2e/searchFeature/afterWaitSearchContainer.png"
      );

    browser.expect
      .element("[class^='title__title']")
      .to.be.present.before(10000);

    browser.end();
  });
});
