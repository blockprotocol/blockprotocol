import chalk from "chalk";

export const printSpacer = () => {
  console.log(
    chalk.bold("–".repeat(Math.min(process.stdout.columns ?? 48, 48))),
  );
};
