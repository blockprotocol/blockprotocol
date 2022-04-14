import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackMainConfig from "../config/webpack-main.config.cjs";
import webpackDevServerConfig from "../config/webpack-dev-server.config.cjs";
import { cleanDist } from "../shared/clean-dist.mjs";
import { serve } from "../shared/serve.mjs";

const script = async () => {
  await cleanDist();

  // Dist compiler
  webpack(
    {
      ...webpackMainConfig,
      mode: "development",
      watch: true,
    },
    (args) => {
      console.log(args);
    },
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
