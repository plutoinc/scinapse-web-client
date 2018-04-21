const chromeDriver = require("chromedriver");
const seleniumServer = require("selenium-server");

module.exports = {
  src_folders: ["e2eTest"],
  output_folder: "output/e2e",
  globals_path: "./e2eTest/globalSetting.js",
  selenium: {
    start_process: true,
    server_path: seleniumServer.path,
    log_path: "output/e2e",
    host: "127.0.0.1",
    port: 4444,
    cli_args: {
      "webdriver.chrome.driver": chromeDriver.path,
    },
  },
  test_settings: {
    default: {
      silent: true,
      asyncHookTimeout: 60000,
      screenshots: {
        enabled: true,
        path: "output/e2e",
        on_failure: true,
        on_error: true,
      },
      globals: {
        waitForConditionTimeout: 60000,
        asyncHookTimeout: 60000,
      },
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: [
            "--no-sandbox",
            "--headless",
            "--disable-gpu",
            "--disable-setuid-sandbox",
            "disable-web-security",
            "ignore-certificate-errors",
          ],
        },
        acceptSslCerts: true,
      },
    },
  },
  test_runner: {
    type: "mocha",
    options: {
      ui: "bdd",
      reporter: "list",
      timeout: 60000,
    },
  },
};
