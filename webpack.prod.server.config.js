const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const originalWebpackConfig = require("./webpack.stage.server.config");

const browserSpecificSetting = {
  plugins: [
    new LodashModuleReplacementPlugin(),
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

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
