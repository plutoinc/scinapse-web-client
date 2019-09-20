const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const cpuLength = require('os').cpus().length;

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './app/clientIndex.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist', 'client'),
    publicPath: '/client/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  devtool: 'eval',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              workers: cpuLength - 1,
            },
          },
          {
            loader: 'babel-loader?cacheDirectory=true',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              esModule: false,
            },
          },
          'svg-transform-loader',
          'svgo-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['isomorphic-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'isomorphic-style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [require('postcss-flexbugs-fixes'), require('precss'), require('autoprefixer')];
              },
            },
          },
          { loader: 'sass-loader' },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: ['./app/_variables.scss'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
    new LoadablePlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.IgnorePlugin(/^\.\/pdf.worker.js$/),
    new WorkboxPlugin.InjectManifest({
      swSrc: './app/sw.js',
      swDest: '../server/sw.js',
    }),
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.TARGET': JSON.stringify('localBrowser'),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    writeToDisk: filePath => {
      return /(loadable-stats\.json|sw.js)/.test(filePath);
    },
    compress: true,
    host: '0.0.0.0',
    allowedHosts: ['localhost', 'lvh.me'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
