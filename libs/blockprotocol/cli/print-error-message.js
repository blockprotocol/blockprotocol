import chalk from "chalk";

import { printSpacer } from "./shared/print-spacer.js";

/**
 * @param {string} errorMessage
 */
export const printErrorMessage = (errorMessage) => {
  console.log(chalk.red(`${errorMessage}. Please check usage.`));
  printSpacer();
};
