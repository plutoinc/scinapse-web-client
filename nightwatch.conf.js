module.exports = (function(settings) {
  if (process.platform === "darwin") {
    // MacOS
    // settings.selenium.cli_args["webdriver.chrome.driver"] = "./bin/chromedriver-mac";
  }

  return settings;
})(require("./nightwatch.json"));
