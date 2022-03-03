import chalk from "chalk";
import execa from "execa";

const script = async () => {
  console.log(chalk.bold("Building..."));

  await execa("yarn", ["build-blocks"], { stdio: "inherit" });

  await execa("yarn", ["generate-blockmetadata-schema"], { stdio: "inherit" });

  await (
    await import("./generate-sitemap")
  ).default;

  await (
    await import("./generate-blocks-data")
  ).default;

  await (
    await import("./create-db-indexes")
  ).default;

  await execa("next", ["build"], { stdio: "inherit" });
};

export default script();
