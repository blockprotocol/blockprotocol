import webpack from "webpack";
import { promisify } from "node:util";
import { generateBaseWebpackConfig } from "../shared/generate-base-webpack-config.js";
import { cleanDist } from "../shared/clean-dist.js";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  await promisifiedWebpack(await generateBaseWebpackConfig("production"));
};

await script();
