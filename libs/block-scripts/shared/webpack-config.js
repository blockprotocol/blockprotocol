import path from "node:path";
import { fileURLToPath } from "node:url";

import CopyPlugin from "copy-webpack-plugin";
import Dotenv from "dotenv-webpack";
import fs from "fs-extra";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import WebpackAssetsManifest from "webpack-assets-manifest";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import { BlockAssetsPlugin } from "./block-assets-plugin.js";
import { extractBlockScriptsConfigFromPackageJson } from "./config.js";
import { packageRootDirPath } from "./paths.js";
import { pickExistingFilePath } from "./pick-existing-file-path.js";

/**
 * @param {"development" | "production"} mode
 * @return {Promise<import("webpack").Configuration>}
 */
const generateBaseWebpackConfig = async (mode) => {
  const packageJsonPath = path.resolve(process.cwd(), "./package.json");
  const { peerDependencies } = await fs.readJson(packageJsonPath);

  const babelrcFilePath = path.resolve(
    packageRootDirPath,
    "assets/babelrc.json",
  );

  return {
    plugins: [
      new webpack.EnvironmentPlugin({
        "process.env.NODE_ENV": mode,
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new WebpackAssetsManifest(),
    ],

    entry: {
      main: await pickExistingFilePath(
        [
          "./src/index.js",
          "./src/index.jsx",
          "./src/index.ts",
          "./src/index.tsx",
        ],
        "block entry point",
      ),
    },
    output: {
      publicPath: "",
      libraryTarget: "commonjs",
      filename: mode === "production" ? "[name].[contenthash].js" : "[name].js",
    },
    externals: Object.fromEntries(
      Object.keys(peerDependencies ?? {}).map((key) => [key, key]),
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

/**
 * @param {"development" | "production"} mode
 * @return {Promise<import("webpack").Configuration>}
 */
export const generateBuildWebpackConfig = async (mode) => {
  const baseWebpackConfig = await generateBaseWebpackConfig(mode);

  const analyze =
    mode === "production" &&
    Boolean(
      ["true", "1"].includes(process.env.ANALYZE || "") ||
        (await extractBlockScriptsConfigFromPackageJson()).analyze,
    );

  return {
    ...baseWebpackConfig,
    watch: mode === "development",
    devtool: mode === "development" ? "inline-source-map" : undefined,
    plugins: [
      ...(baseWebpackConfig.plugins ?? []),
      ...(mode === "production" ? [new BlockAssetsPlugin()] : []),
      new CopyPlugin({
        patterns: [{ from: "./public/", to: "./public/" }],
      }),
      ...(analyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
              openAnalyzer: false,
              reportFilename: "webpack-bundle-analyzer-report.html",
            }),
          ]
        : []),
    ],
  };
};

/**
 * @return {Promise<import("webpack").Configuration>}
 */
export const generateDevWebpackConfig = async () => {
  const baseWebpackConfig = await generateBaseWebpackConfig("development");

  return {
    devtool: "eval-cheap-module-source-map",
    entry: {
      dev: await pickExistingFilePath(
        ["./src/dev.js", "./src/dev.jsx", "./src/dev.ts", "./src/dev.tsx"],
        "dev server entry point",
      ),
    },
    plugins: [
      ...(baseWebpackConfig.plugins ?? []),
      new BlockAssetsPlugin(),
      new Dotenv(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "../assets/index.html",
        ),
      }),
    ],
    module: baseWebpackConfig.module,
    mode: "development",
    target: "web",
    optimization: {
      moduleIds: "named",
    },
    resolve: baseWebpackConfig.resolve,
    stats: "minimal",
  };
};
