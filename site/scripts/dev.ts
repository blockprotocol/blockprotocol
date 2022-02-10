import chalk from "chalk";
import execa from "execa";

const script = async () => {
  console.log(chalk.bold("Launching site in dev mode..."));

  await (
    await import("./generate-sitemap")
  ).default;

  await (
    await import("./generate-blocks-data")
  ).default;

  await (
    await import("./create-db-indexes")
  ).default;

  await execa("next", ["dev"], { stdio: "inherit" });
};

export default script();
