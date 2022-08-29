const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

/** @type import("webpack").Configuration */
module.exports = {
  devtool: "eval-cheap-module-source-map",
  entry: "./dev/dev-app.tsx",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./dev/index.html",
    }),
    new webpack.EnvironmentPlugin({
      "process.env.NODE_ENV": process.env.NODE_ENV,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
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
    port: 9090,
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
