import chalk from "chalk";
import { execa } from "execa";

const script = async () => {
  if (process.env.TEST_COVERAGE) {
    console.log(
      chalk.bold("Launching site in prod mode with enabled TEST_COVERAGE..."),
    );
    await execa("nyc", ["--cwd=../..", "--clean=false", "next", "start"], {
      stdio: "inherit",
    });
  } else {
    console.log(chalk.bold("Launching site in prod mode..."));
    await execa("next", ["start"], { stdio: "inherit" });
  }
};

await script();
