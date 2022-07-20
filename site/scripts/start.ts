// nyc --clean=false next start

import chalk from "chalk";
import execa from "execa";

const script = async () => {
  if (process.env.CODE_COVERAGE) {
    console.log(
      chalk.bold("Launching site in prod mode with enabled CODE_COVERAGE..."),
    );
    await execa("nyc", ["--clean=false", "next", "start"], {
      stdio: "inherit",
    });
  } else {
    console.log(chalk.bold("Launching site in prod mode..."));
    await execa("next", ["start"], { stdio: "inherit" });
  }
};

await script();
