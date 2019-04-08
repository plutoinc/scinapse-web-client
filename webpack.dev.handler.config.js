const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: ["./server/devHandler.tsx"],
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: "handler.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
      },
    ]
  },
  optimization: {
    minimize: false,
    nodeEnv: "dev",
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [/(tmp\/server\/main\.js)/i, nodeExternals()],
};
