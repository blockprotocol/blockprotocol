/* eslint-disable global-require */
/**
 * generates:
 *  - dist/main.js
 *  - dist/manifest.json
 *  - dist/webpack-bundle-analyzer-report.html
 */
const path = require("path");
const webpack = require("webpack");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyPlugin = require("copy-webpack-plugin");
const { StatsPlugin } = require("./webpack-block-metadata-plugin.cjs");

const packageJsonPath = path.resolve(process.cwd(), "./package.json");
// eslint-disable-next-line import/no-dynamic-require
const { peerDependencies } = require(packageJsonPath);

/**
 * @param {"development" | "production"} mode
 */
module.exports = (mode) => ({
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "webpack-bundle-analyzer-report.html",
    }),
    new WebpackAssetsManifest({
      output: "manifest.json",
    }),
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": mode,
    }),
    new StatsPlugin(),
    new CopyPlugin({ patterns: [{ from: "./public/", to: "./public/" }] }),
  ],

  entry: {
    main: "./src/index.ts",
  },
  output: {
    libraryTarget: "commonjs",
    filename: mode === "production" ? "main.[contenthash].js" : "main.js",
  },
  externals: Object.fromEntries(
    Object.keys(peerDependencies).map((key) => [key, key]),
  ),
  mode,
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: require("./babelrc.json"),
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
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
});
