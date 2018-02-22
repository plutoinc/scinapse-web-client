describe("Pluto Main Page", function() {
  it("should render proper page", function(browser) {
    browser
      .url("https://search.pluto.network")
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(3000);

    browser.assert.title("Pluto Beta | Academic discovery");
  });
});
