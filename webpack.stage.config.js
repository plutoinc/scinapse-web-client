const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWepbackConfig = require("./webpack.config");

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
      NODE_ENV: "stage",
    }),
  ],
};

const webpackOptionsForBrowser = { ...originalWepbackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
