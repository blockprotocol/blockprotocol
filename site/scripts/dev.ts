import chalk from "chalk";
import execa from "execa";

const script = async () => {
  console.log(chalk.bold("Launching site in dev mode..."));

  await import("./generate-sitemap");

  await import("./generate-blocks-data");

  await import("./create-db-indexes");

  await execa("next", ["dev"], { stdio: "inherit" });
};

await script();
