import chalk from "chalk";
import execa from "execa";
import fs from "fs-extra";
import path from "node:path";

const script = async () => {
  console.log(chalk.bold("Building..."));

  if (process.env.CI) {
    await import("./copy-blocks-from-ci-cache");
  }

  await import("./prepare-blocks");

  await import("./make-block-assets-compatible-with-vercel-lambdas");

  await execa("yarn", ["generate-blockmetadata-schema"], { stdio: "inherit" });

  await import("./generate-sitemap");

  await import("./generate-blocks-data");

  await import("./create-db-indexes");

  const babelConfigPath = path.resolve(process.cwd(), "babel.config.json");
  if (process.env.INSTRUMENT_COVERAGE) {
    await fs.writeJson(babelConfigPath, {
      presets: ["next/babel"],
      plugins: ["istanbul"],
    });
    await execa("nyc", ["next", "build"], { stdio: "inherit" });
    await fs.remove(babelConfigPath);
  } else {
    if (await fs.pathExists(babelConfigPath)) {
      await fs.remove(babelConfigPath);
    }
    await execa("next", ["build"], { stdio: "inherit" });
  }

  if (process.env.CI) {
    await import("./copy-blocks-to-ci-cache");
  }
};

await script();
