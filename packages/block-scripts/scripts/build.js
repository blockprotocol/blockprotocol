import webpack from "webpack";
import { promisify } from "node:util";
import chalk from "chalk";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { generateBaseWebpackConfig } from "../shared/generate-base-webpack-config.js";
import { cleanDist } from "../shared/clean-dist.js";
import { blockDistDirPath } from "../shared/paths.js";
import { extractBlockScriptsConfigFromPackageJson } from "../shared/config.js";

const promisifiedWebpack = promisify(webpack);

const script = async () => {
  await cleanDist();

  const baseWebpackConfig = await generateBaseWebpackConfig("production");

  const analyze = Boolean(
    ["true", "1"].includes(process.env.ANALYZE) ||
      (await extractBlockScriptsConfigFromPackageJson()).analyze,
  );

  /** @type import("webpack").Configuration */
  const webpackConfig = {
    ...baseWebpackConfig,
    plugins: analyze
      ? [
          ...baseWebpackConfig.plugins,
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            reportFilename: "webpack-bundle-analyzer-report.html",
          }),
        ]
      : baseWebpackConfig.plugins,
  };

  const stats = await promisifiedWebpack(webpackConfig);

  if (stats.hasErrors()) {
    console.log(stats.toString());
    console.log(chalk.red("Errors occurred while building the block"));

    process.exit(1);
  } else {
    console.log(
      `Done. Build result is ready to be served from ${blockDistDirPath}`,
    );
  }
};

await script();
