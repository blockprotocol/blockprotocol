import chalk from "chalk";
import execa from "execa";

const script = async () => {
  console.log(chalk.bold("Building..."));

  if (process.env.VERCEL) {
    await (
      await import("./copy-blocks-from-ci-cache")
    ).default;
  }

  await (
    await import("./prepare-blocks")
  ).default;

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

  if (process.env.VERCEL) {
    await (
      await import("./copy-blocks-to-ci-cache")
    ).default;
  }
};

export default script();
