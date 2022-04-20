import webpack from "webpack";
import { promisify } from "node:util";
import generateBaseWebpackConfig from "../config/generate-base-webpack-config.cjs";
import { cleanDist } from "../shared/clean-dist.js";
import { ensureBlockSchemaInDist } from "../shared/ensure-block-schema-in-dist.js";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  await ensureBlockSchemaInDist();

  await promisifiedWebpack(generateBaseWebpackConfig("production"));
};

await script();
