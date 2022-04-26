import path from "node:path";
import webpack from "webpack";
import fs from "fs-extra";

// const WebpackAssetsManifest = require("webpack-assets-manifest");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
import CopyPlugin from "copy-webpack-plugin";

import { BlockAssetsPlugin } from "./block-assets-plugin.js";
import { packageRootDirPath } from "./paths.js";

/**
 * @param {"development" | "production"} mode
 * @return {import("webpack").Configuration}
 */
export const generateBaseWebpackConfig = async (mode) => {
  const packageJsonPath = path.resolve(process.cwd(), "./package.json");
  const { peerDependencies } = await fs.readJson(packageJsonPath);

  const babelrcFilePath = path.resolve(
    packageRootDirPath,
    "assets/babelrc.json",
  );

  return {
    plugins: [
      // new BundleAnalyzerPlugin({
      //   analyzerMode: "static",
      //   openAnalyzer: false,
      //   reportFilename: "webpack-bundle-analyzer-report.html",
      // }),
      // new WebpackAssetsManifest({
      //   output: "manifest.json",
      // }),
      new webpack.EnvironmentPlugin({
        "process.env.NODE_ENV": mode,
      }),
      new BlockAssetsPlugin(),
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
            options: await fs.readJson(babelrcFilePath),
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
    stats: "minimal",
  };
};
