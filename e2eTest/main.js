describe("Pluto Main Page", function() {
  it("should render proper page", function(browser) {
    var targetUrl;
    if (process.env.NODE_ENV === "production") {
      targetUrl = "https://search.pluto.network";
    } else {
      targetUrl = "https://search-stage.pluto.network";
    }

    browser
      .url(targetUrl)
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(3000);

    browser.assert.title("Pluto Beta | Academic discovery");
  });
});
