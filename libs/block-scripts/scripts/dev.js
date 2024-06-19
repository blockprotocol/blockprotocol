import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import { cleanDist } from "../shared/clean-dist.js";
import { getPort } from "../shared/config.js";
import {
  generateBuildWebpackConfig,
  generateDevWebpackConfig,
} from "../shared/webpack-config.js";

const script = async () => {
  await cleanDist();

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
    static: {
      directory: "dist",
    },
    port: await getPort("development"),
    watchFiles: ["block-schema.json", "package.json", "public/**", "README.md"],
  };

  const buildWebpackConfig = await generateBuildWebpackConfig("development");
  const devWebpackConfig = await generateDevWebpackConfig();

  webpack(buildWebpackConfig, () => {});

  const devCompiler = webpack(devWebpackConfig);
  const devServer = new WebpackDevServer(webpackDevServerConfig, devCompiler);
  await devServer.start();
};

await script();
