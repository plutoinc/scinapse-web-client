module.exports = {
  "사용자는 검색어를 입력 후 검색어가 포함된 자동 완성 리스트를 볼 수 있다.": function(browser) {
    browser
      .url("https://google.com")
      .waitForElementVisible("body", 1000)
      .setValue("input[type=text]", "nightwatch")
      .pause(1000)
      .assert.containsText("##sbtc", "nightwatch")
      .end();
  },
};
