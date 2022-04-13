/**
 * generates:
 *  - dist/main.js
 *  - dist/manifest.json
 *  - dist/webpack-bundle-analyzer-report.html
 */
const path = require("path");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyPlugin = require("copy-webpack-plugin");
const { StatsPlugin } = require("./webpack-block-metadata-plugin.cjs");

const packageJsonPath = path.resolve(process.cwd(), "./package.json")
const { peerDependencies } = require(packageJsonPath);

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "webpack-bundle-analyzer-report.html",
    }),
    new WebpackAssetsManifest({
      output: "manifest.json",
    }),
    new StatsPlugin(),
    new CopyPlugin({ patterns: [{ from: "./public/", to: "./public/" }] }),
  ],

  entry: {
    main: "./src/index.ts",
  },
  output: {
    libraryTarget: "commonjs",
    filename: "main.[contenthash].js",
  },
  externals: Object.fromEntries(
    Object.keys(peerDependencies).map((key) => [key, key]),
  ),
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: require('./babelrc.json')
        },
      },
    ],
  },
  resolve: {
    extensions: [
      ".ts", // Add typescript support
      ".tsx", // Add typescript + react support
      ".js", // Preserving webpack default
      ".jsx", // Preserving webpack default
      ".json", // Preserving webpack default
      ".css", // Preserving webpack default
    ],
  },
};
