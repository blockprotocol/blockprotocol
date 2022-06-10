import chalk from "chalk";

const script = async () => {
  console.log(chalk.bold("Preparing..."));

  await import("./generate-sitemap");

  await import("./generate-blocks-data");
};

await script();
