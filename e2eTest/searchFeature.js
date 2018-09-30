describe("Pluto Search Features", function() {
  it("should render search result", function(browser) {
    var targetUrl;
    var randomNumber = Math.random();
    var rationalNumber = Math.floor(randomNumber * 1000000);
    if (process.env.NODE_ENV === "production") {
      targetUrl = `https://scinapse.io?cacheExpire=${rationalNumber}`;
    } else {
      targetUrl = `https://dev.scinapse.io?branch=${process.env.BRANCH_NAME}&cacheExpire=${rationalNumber}`;
    }

    browser
      .url(targetUrl)
      .pause(10000)
      .saveScreenshot("./output/e2e/searchFeature/after_load_page.png")
      .waitForElementVisible("[class^='inputBox_searchInputWrapper']", 1000)
      .setValue(
        "[class^='inputBox_searchInputWrapper'] > [placeholder='Search papers by title, author, doi or keyword']",
        ["of", browser.Keys.ENTER]
      )
      .saveScreenshot("./output/e2e/searchFeature/after_submit_search_term.png")
      .waitForElementVisible("[class^='articleSearch_articleSearchContainer']", 10000)
      .saveScreenshot("./output/e2e/searchFeature/afterWaitSearchContainer.png");

    browser.expect.element("[class^='title_title']").to.be.present.before(30000);

    browser.end();
  });
});
