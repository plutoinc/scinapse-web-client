const getBaseHost = require("./helpers/getBaseHost").default;

describe("Pluto Main Page", function() {
  it("should render search input with proper placeholder", function(browser) {
    const randomNumber = Math.random();
    const rationalNumber = Math.floor(randomNumber * 1000000);
    const targetUrl = `${getBaseHost()}?cacheExpire=${rationalNumber}`;

    browser
      .url(targetUrl)
      .waitForElementVisible("body", 3000)
      .saveScreenshot("./output/e2e/homePage/homepageInitialLoad.png")
      .expect.element("[placeholder='Search papers by title, author, doi or keyword']")
      .to.be.present.before(3000);
  });

  it("should render proper title property", browser => {
    browser
      .saveScreenshot("./output/e2e/homePage/afterLoadHomepage.png")
      .expect.element("title")
      .to.have.attribute("textContent")
      .which.equal("Sci-napse | Academic search engine for paper")
      .before(4000);
  });
});
