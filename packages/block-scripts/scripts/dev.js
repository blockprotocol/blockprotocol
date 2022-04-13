import webpack from "webpack";
import webpackMainConfig from "../config/webpack-main.config.cjs";
import { cleanDist } from "../shared/clean-dist.js";
import { serveDist } from "../shared/serve-dist.js";

const script = async () => {
  await cleanDist();

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

  serveDist(9090);
  // await Promise.any([webpack({})]);
};

await script();
