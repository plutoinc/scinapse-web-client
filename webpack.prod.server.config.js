const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const originalWebpackConfig = require("./webpack.dev.server.config");
const TerserPlugin = require("terser-webpack-plugin");
const browserSpecificSetting = {
  mode: "production",
  entry: ["@babel/polyfill", "./app/index.tsx"],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
      }),
    ],
  },
  plugins: [new LodashModuleReplacementPlugin()],
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
