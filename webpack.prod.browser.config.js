const originalWebpackConfig = require("./webpack.dev.browser.config");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const browserSpecificSetting = {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: false,
      }),
    ],
  },
  devtool: false,
  plugins: [
    // new BundleAnalyzerPlugin(),
    new LodashModuleReplacementPlugin(),
  ],
};

const webpackOptionsForBrowser = { ...originalWebpackConfig, ...browserSpecificSetting };

module.exports = webpackOptionsForBrowser;
