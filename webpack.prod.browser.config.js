const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const originalWepbackConfig = require("./webpack.stage.browser.config");

const browserSpecificSetting = {
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
      NODE_ENV: "production",
    }),
  ],
};

const webpackOptionsForBrowser = { ...originalWepbackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
