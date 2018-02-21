const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWepbackConfig = require("./webpack.config");

const BROWSER_BUNDLE_FILE_NAME = "bundleBrowser.js";

const browserSpecificSetting = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: BROWSER_BUNDLE_FILE_NAME,
  },
  plugins: [
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: "app/index.ejs",
      inject: false,
      NODE_ENV: "stage",
    }),
  ],
};

const webpackOptionsForBrowser = { ...originalWepbackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
