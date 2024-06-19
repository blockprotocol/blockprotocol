import path from "node:path";

import chalk from "chalk";
import { globby } from "globby";

import { printSpacer } from "../../shared/print-spacer.js";
import { findProjectRoot } from "./shared/find-project-root.js";

/**
 * Attempts to find block's distribution files
 * by searching for block-metadata.json with the following strategy:
 * 1. Look in the current working directory and its subfolders
 * 2. If none found, search up for a folder containing package.json, and then search within
 *
 * If multiple block-metadata.json are found, a path containing 'dist' is preferred
 * This is to accommodate templates where block-metadata.json is found both in the root
 * and then (expanded) in the distribution folder – @see libs/block-template-html/src/app.js
 *
 * @returns {Promise<string>}
 */
export const findBlockFolder = async () => {
  let metadataJsonPaths = await globby("**/block-metadata.json", {
    absolute: true,
    cwd: process.cwd(),
    caseSensitiveMatch: false,
  });

  if (!metadataJsonPaths) {
    const projectRootPath = await findProjectRoot();
    if (projectRootPath) {
      metadataJsonPaths = await globby("**/block-metadata.json", {
        absolute: true,
        cwd: projectRootPath,
        caseSensitiveMatch: false,
      });
    }
  }

  if (!metadataJsonPaths[0]) {
    console.log(chalk.red("Could not find block folder"));
    console.log(
      "We look for 'block-metadata.json' in the current working directory, then from the project root. Does it exist?",
    );
    console.log(
      `You can also specify a path to the block's distribution folder with ${chalk.bold(
        "-p",
      )} or ${chalk.bold("--path")}`,
    );
    printSpacer();
    process.exit(1);
  }

  const metadataJsonPath =
    metadataJsonPaths.find((possiblePath) => possiblePath.includes("dist/")) ??
    metadataJsonPaths[0];

  return path.dirname(metadataJsonPath);
};
