const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Jarvis = require("webpack-jarvis");
const { CheckerPlugin } = require("awesome-typescript-loader");
require("extract-text-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", "./app/index.tsx"],
  output: {
    filename: "./dist/bundle.js",
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
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
        test: /\.md?$/,
        use: [{ loader: "html-loader" }, { loader: "markdown-loader" }],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]__[hash:base64:6]",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [require("precss"), require("autoprefixer"), require("postcss-flexbugs-fixes")];
              },
            },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  node: {
    fs: "empty",
  },
  externals: {
    "react/lib/ExecutionEnvironment": true,
    "react/lib/ReactContext": true,
    "react/addons": true,
  },
  plugins: [
    new CheckerPlugin(),
    new Jarvis({
      port: 1337,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "app/index.ejs",
      inject: false,
      NODE_ENV: "development",
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "app"),
    compress: true,
    host: "0.0.0.0",
    hot: true,
    allowedHosts: ["localhost", "lvh.me"],
  },
};
