import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import generateBaseWebpackConfig from "../config/generate-base-webpack-config.cjs";
import webpackDevServerConfig from "../config/webpack-dev-server.config.cjs";
import { cleanDist } from "../shared/clean-dist.mjs";
import { serve } from "../shared/serve.mjs";
import { ensureBlockSchemaInDist } from "../shared/ensure-block-schema-in-dist.mjs";

const script = async () => {
  await cleanDist();

  await ensureBlockSchemaInDist();

  // Dist compiler
  webpack(
    {
      ...generateBaseWebpackConfig("development"),
      watch: true,
    },
    () => {},
  );

  // Dev server
  const compiler = webpack(webpackDevServerConfig);
  const server = new WebpackDevServer(
    webpackDevServerConfig.devServer,
    compiler,
  );
  await server.start();

  serve();
};

await script();
