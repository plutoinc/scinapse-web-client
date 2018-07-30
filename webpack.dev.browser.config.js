const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWepbackConfig = require("./webpack.config");

const BROWSER_BUNDLE_FILE_NAME = "bundleBrowser.js";

const browserSpecificSetting = {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: BROWSER_BUNDLE_FILE_NAME,
  },
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    occurrenceOrder: true,
    noEmitOnErrors: true,
    providedExports: true,
    minimize: false,
    nodeEnv: "dev",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.ejs",
      inject: false,
      NODE_ENV: "dev",
    }),
  ],
};

const webpackOptionsForBrowser = { ...originalWepbackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
