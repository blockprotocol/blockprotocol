import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import generateBaseWebpackConfig from "../config/generate-base-webpack-config.cjs";
import webpackDevServerConfig from "../config/webpack-dev-server.config.cjs";
import { cleanDist } from "../shared/clean-dist.js";
import { serveDist } from "../shared/serve-dist.js";
import { ensureBlockSchemaInDist } from "../shared/ensure-block-schema-in-dist.js";
import {
  extractBlockScriptsConfigFromPackageJson,
  extractScriptConfig,
} from "../shared/config.js";

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
  const devPort =
    Number.parseInt(extractScriptConfig().listen, 10) ||
    Number.parseInt(
      (await extractBlockScriptsConfigFromPackageJson()).devPort,
      10,
    ) ||
    9090;

  const compiler = webpack(webpackDevServerConfig);
  const server = new WebpackDevServer(
    { ...webpackDevServerConfig.devServer, port: devPort },
    compiler,
  );
  await server.start();

  serveDist();
};

await script();
