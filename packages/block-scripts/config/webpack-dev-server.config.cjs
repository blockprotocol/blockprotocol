const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const generateBaseWebpackConfig = require("./generate-base-webpack-config.cjs");

const config = generateBaseWebpackConfig("development");

/** @type import("webpack").Configuration */
module.exports = {
  devtool: "eval-cheap-module-source-map",
  entry: "./src/dev.js",
  plugins: [
    ...config.plugins,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "index.html"),
    }),
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": "development",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: config.module,
  mode: "development",
  target: "web",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": [
        "X-Requested-With, content-type, Authorization",
        "X-Requested-With",
        "content-type",
        "Authorization",
        "sentry-trace",
      ],
    },
    hot: true,
    open: process.env.BROWSER !== "none",
    static: {
      directory: __dirname,
    },
  },
  optimization: {
    moduleIds: "named",
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
