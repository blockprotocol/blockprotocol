import chalk from "chalk";

const script = async () => {
  console.log(chalk.bold("Preparing..."));

  await (
    await import("./generate-sitemap")
  ).default;

  await (
    await import("./generate-blocks-data")
  ).default;
};

export default script();
