describe("Pluto Main Page", function() {
  it("should render proper page", function(browser) {
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
      .to.be.present.before(3000);

    browser.assert.title("Sci-napse | Academic search engine for paper");
  });
});
