describe("Pluto Search Feature works", function() {
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
      .to.be.present.before(30000);

    browser
      .setValue(
        "[class^='inputBox__searchInputWrapper'] > [placeholder='Search papers by title, author, doi or keyword']",
        ["of", browser.Keys.ENTER],
      )
      .pause(30000);

    browser.expect.element("[class^='articleSearch__articleSearchContainer']").to.be.present;
  });
});
