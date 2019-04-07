const path = require("path");
const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["@babel/polyfill", "./app/clientIndex.tsx"],
  output: {
    path: path.resolve(__dirname, "dist", "client"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  optimization: {
    minimize: false,
    nodeEnv: "dev",
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader",
        options: {
          useBabel: true,
          useCache: false,
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
  plugins: [new LoadablePlugin()],
};
