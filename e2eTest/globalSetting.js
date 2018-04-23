var chromedriver = require("chromedriver");

module.exports = {
  before: function(done) {
    chromedriver.start();
    done();
  },

  after: function(done) {
    console.log("ALL TESTS ARE DONE!");
    chromedriver.stop();
    done();
  },

  // This will be run before each test suite is started
  beforeEach: function(browser, done) {
    // getting the session info
    browser.status(function(result) {
      console.log("START TEST");
      console.log(result.value);
      done();
    });
  },

  // This will be run after each test suite is finished
  afterEach: function(browser, done) {
    console.log(browser.currentTest);
    done();
  },
};
