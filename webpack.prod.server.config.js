const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const originalWebpackConfig = require("./webpack.stage.server.config");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const browserSpecificSetting = {
  mode: "production",
  entry: ["babel-polyfill", "./app/index.tsx"],
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
  },
  plugins: [new LodashModuleReplacementPlugin()],
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
