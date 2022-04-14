import webpack from "webpack";
import { promisify } from "node:util";
import webpackMainConfig from "../config/webpack-main.config.cjs";
import { cleanDist } from "../shared/clean-dist.mjs";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  await promisifiedWebpack({ ...webpackMainConfig, mode: "production" });
};

await script();
