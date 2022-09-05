import chalk from "chalk";

import { printSpacer } from "./print-spacer.js";

/**
 * @param {string} errorMessage
 */
export const printErrorMessage = (errorMessage) => {
  console.log(chalk.red(`Error: ${errorMessage}. Please check usage.`));
  printSpacer();
};
