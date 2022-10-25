import chalk from "chalk";

const script = async () => {
  console.log(chalk.bold("Generating code..."));

  await import("./generate-sitemap.js");

  await import("./generate-blocks-data.js");
};

await script();
