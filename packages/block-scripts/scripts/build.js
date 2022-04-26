import webpack from "webpack";
import { promisify } from "node:util";
import chalk from "chalk";
import { generateBaseWebpackConfig } from "../shared/generate-base-webpack-config.js";
import { cleanDist } from "../shared/clean-dist.js";
import { blockDistDirPath } from "../shared/paths.js";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  const stats = await promisifiedWebpack(
    await generateBaseWebpackConfig("production"),
  );

  if (stats.hasErrors()) {
    console.log(stats.toString());
    console.log(chalk.red("Errors occurred while building the block"));

    process.exit(1);
  } else {
    console.log(`Done. Build result can be found in ${blockDistDirPath}`);
  }
};

await script();
