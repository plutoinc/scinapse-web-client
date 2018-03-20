describe("Pluto Main Page", function() {
  it("should render proper page", function(browser) {
    var targetUrl;
    if (process.env.NODE_ENV === "production") {
      targetUrl = "https://scinapse.io";
    } else {
      targetUrl = "https://stage.scinapse.io";
    }

    browser
      .url(targetUrl)
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(3000);

    browser.assert.title("sci-napse | Academic search engine for paper");
  });
});
