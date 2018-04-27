const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWepbackConfig = require("./webpack.config");

const browserSpecificSetting = {
  mode: "production",
  entry: ["babel-polyfill", "./app/index.tsx"],
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
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
    nodeEnv: "stage",
  },
  target: "node",
};

delete originalWepbackConfig.node;

const webpackOptionsForBrowser = { ...originalWepbackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
