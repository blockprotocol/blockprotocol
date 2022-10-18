import chalk from "chalk";

export class UserFriendlyError extends Error {}

if (typeof process !== "undefined") {
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
}
