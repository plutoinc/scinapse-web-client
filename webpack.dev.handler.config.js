const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const originalWebpackConfig = require("./webpack.config");

const browserSpecificSetting = {
  mode: "production",
  entry: ["./app/server/devRenderer.tsx"],
  output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "dist"),
    filename: "handler.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: "devHandlerTsconfig.json",
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader",
        options: {
          classPrefix: false,
          idPrefix: true,
        },
      },
      {
        test: /\.html$/,
        use: ["raw-loader"],
      },
      {
        test: /\.css$/,
        use: ["isomorphic-style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "isomorphic-style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]_[local]_[hash:base64:5]",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => {
                return [require("postcss-flexbugs-fixes"), require("precss"), require("autoprefixer")];
              },
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
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
