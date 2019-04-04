const path = require("path");

module.exports = {
  mode: "production",
  entry: ["./server/devHandler.tsx"],
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: "handler.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
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
    ]
  },
  optimization: {
    nodeEnv: "dev",
  },
  target: "node",
  externals: /(tmp\/bundle\.js)/i,
};
