import chalk from "chalk";
import fs from "fs-extra";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import { cleanDist } from "../shared/clean-dist.js";
import { getPort } from "../shared/config.js";
import { generateBaseWebpackConfig } from "../shared/generate-base-webpack-config.js";

const entryPointFilePaths = [
  "./src/dev.js",
  "./src/dev.jsx",
  "./src/dev.ts",
  "./src/dev.tsx",
];

const script = async () => {
  let entryPointFilePath;
  for (const candidateDevEntryPointFilePath of entryPointFilePaths) {
    if (await fs.pathExists(candidateDevEntryPointFilePath)) {
      entryPointFilePath = candidateDevEntryPointFilePath;
      break;
    }
  }

  if (!entryPointFilePath) {
    console.log(
      chalk.red(
        `Unable to find entry point for the dev server. Please create one of these files: ${entryPointFilePaths.join(
          ", ",
        )}`,
      ),
    );
    process.exit(1);
  }

  await cleanDist();

  const baseWebpackConfig = await generateBaseWebpackConfig("development");

  /** @type import("webpack").Configuration */
  const webpackConfig = {
    devtool: "eval-cheap-module-source-map",
    entry: entryPointFilePath,
    plugins: [
      ...baseWebpackConfig.plugins,
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "../assets/index.html",
        ),
      }),
      new webpack.EnvironmentPlugin({
        "process.env.NODE_ENV": "development",
      }),
      new webpack.HotModuleReplacementPlugin(),
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

  /**
   * @type import("webpack-dev-server").Configuration
   */
  const webpackDevServerConfig = {
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
      "Cache-Control": "no-store",
    },
    hot: true,
    open: process.env.BROWSER !== "none",
    static: {
      directory: "dist",
    },
    port: await getPort("development"),
    watchFiles: [
      "block-schema.json",
      "package.json",
      "public/**/*",
      "README.md",
    ],
  };

  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(webpackDevServerConfig, compiler);
  await server.start();
};

await script();
