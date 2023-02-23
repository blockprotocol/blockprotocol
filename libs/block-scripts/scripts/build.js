import { promisify } from "node:util";

import chalk from "chalk";
import webpack from "webpack";

import { cleanDist } from "../shared/clean-dist.js";
import { blockDistDirPath } from "../shared/paths.js";
import { generateBuildWebpackConfig } from "../shared/webpack-config.js";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  const stats = await promisifiedWebpack([
    await generateBuildWebpackConfig("production"),
  ]);

  if (!stats || stats.hasErrors()) {
    if (stats) {
      console.log(stats.toString());
    }
    console.log(chalk.red("Errors occurred while building the block"));

    process.exit(1);
  } else {
    console.log(
      `Done. Build result is ready to be served from ${blockDistDirPath}`,
    );
  }
};

await script();
