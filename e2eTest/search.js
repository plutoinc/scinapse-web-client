describe("Pluto Search Feature works", function() {
  it("should render search result", function(browser) {
    browser
      .url("https://search.pluto.network")
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(3000);

    browser.setValue("[placeholder='Search papers']", ["paper", browser.Keys.ENTER]).pause(3000);

    browser.expect.element("[class^='articleSearch__articleSearchContainer']").to.be.present;
  });
});
