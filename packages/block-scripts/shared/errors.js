import chalk from "chalk";

/** If unhandled, printed to stdout without a call stack */
export class UserFriendlyError extends Error {}

process.on("uncaughtException", (error) => {
  if (error instanceof UserFriendlyError) {
    if (error.message) {
      console.log(chalk.red(error.message));
    }
  } else {
    console.log(error);
  }
  process.exit(1);
});
