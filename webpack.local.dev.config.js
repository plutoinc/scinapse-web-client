const path = require("path");
const { CheckerPlugin } = require("awesome-typescript-loader");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./server/localServer.tsx"],
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist", "server"),
    filename: "[name].js",
  },
  devtool: false,
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
          useBabel: true,
          useCache: true,
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
                return [require("precss"), require("autoprefixer"), require("postcss-flexbugs-fixes")];
              },
            },
          },
          { loader: "sass-loader" },
          {
            loader: "sass-resources-loader",
            options: {
              resources: ["./app/_variables.scss"],
            },
          },
        ],
      },
    ],
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [new CheckerPlugin()],
  externals: [nodeExternals()],
};
