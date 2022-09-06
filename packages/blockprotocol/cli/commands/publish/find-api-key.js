import chalk from "chalk";
import { findUp } from "find-up";
import fs from "fs-extra";
import path from "node:path";

import { printSpacer } from "../../print-spacer.js";
import { doesUserAgree } from "./does-user-agree.js";
import { findProjectRoot } from "./shared/find-project-root.js";

const environmentVariableName = "BLOCK_PROTOCOL_API_KEY";
const configFileName = ".bprc.json";
const configFileKey = "apiKey";
const configFileTemplate = {
  [configFileKey]:
    "b10ck5.00000000000000000000000000000000.00000000-0000-0000-0000-000000000000",
};

/**
 * Retrieve an API key from a provided JSON file
 * @param {string} filePath
 */
const extractKeyFromJsonFile = (filePath) => {
  let parsedJson;
  try {
    parsedJson = JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    console.log(`Could not parse config file: ${chalk.red(err.message)}`);
    console.log(`Path: ${filePath}`);
    process.exit();
  }
  const key = parsedJson[configFileKey];

  if (!key) {
    console.log(
      `Config file ${chalk.red("does not contain")} '${configFileKey}' key.`,
    );
    console.log(`Path: ${filePath}`);
    process.exit();
  }

  console.log(chalk.green(`Found API key in configuration file.`));
  return key;
};

export const findApiKey = async () => {
  const keyInEnvironment = process.env[environmentVariableName];

  if (keyInEnvironment) {
    console.log(chalk.green("Found API key in environment."));
    return keyInEnvironment;
  }

  const existingConfigFilePath = await findUp(configFileName);
  if (existingConfigFilePath) {
    return extractKeyFromJsonFile(existingConfigFilePath);
  }

  printSpacer();
  console.log(chalk.red("No API key found."));
  console.log(
    chalk.bold("Please either:\n"),
    `  - set ${environmentVariableName} in the environment\n`,
    `  - create a a file named ${configFileName} at the project root with the key under '${configFileKey}'`,
  );

  const projectRootPath = await findProjectRoot();
  if (projectRootPath) {
    const agreement = await doesUserAgree(
      `Would you like a ${configFileName} created at the project root?`,
    );
    if (agreement) {
      const newConfigFilePath = path.resolve(projectRootPath, configFileName);
      fs.writeJsonSync(newConfigFilePath, configFileTemplate, { spaces: 2 });
      console.log(chalk.green("Created file:"), newConfigFilePath);
    }
  }

  printSpacer();
  process.exit();
};
