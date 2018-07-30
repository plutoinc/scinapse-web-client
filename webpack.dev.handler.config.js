const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWebpackConfig = require("./webpack.config");

const browserSpecificSetting = {
  mode: "production",
  entry: ["babel-polyfill", "./app/server/devRenderer.tsx"],
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    filename: "handler.js",
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
  target: "node",
  externals: /(tmp\/bundle\.js)/i,
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
