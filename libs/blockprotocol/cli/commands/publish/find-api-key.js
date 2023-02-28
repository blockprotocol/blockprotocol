import path from "node:path";

import chalk from "chalk";
import { findUp } from "find-up";
import fs from "fs-extra";

import { printSpacer } from "../../shared/print-spacer.js";
import { doesUserAgree } from "./does-user-agree.js";
import { findProjectRoot } from "./shared/find-project-root.js";

const environmentVariableName = "BLOCK_PROTOCOL_API_KEY";
const configFileName = ".blockprotocolrc";
const configFileKey = "api-key";
const configFileTemplate = `${configFileKey}=b10ck5.00000000000000000000000000000000.00000000-0000-0000-0000-000000000000`;

/**
 * Retrieve an API key from a provided file of key=value lines
 *
 * @param {string} filePath
 * @param {string | undefined} namespace
 * @return {string}
 */
const extractKeyFromRcFile = (filePath, namespace) => {
  const fileContent = fs.readFileSync(filePath);
  const lines = fileContent.toString().split("\n");
  for (const line of lines) {
    const [key, value] = line.split("=");
    if (namespace && key === `${configFileKey}-${namespace}` && value) {
      console.log(
        chalk.green(`Found API key for @${namespace} in configuration file.`),
      );
      return value;
    }

    if (key === configFileKey && value) {
      console.log(chalk.green(`Found API key in configuration file.`));
      return value;
    }
  }

  console.log(
    `Config file ${chalk.red("does not contain")} '${configFileKey}' key.`,
  );
  console.log(`Path: ${filePath}`);
  process.exit(1);
};

/**
 * @param {string | undefined} namespace - if set, a suffixed env var / config file key
 *    will be used if defined. This is useful when we want to deploy blocks in different
 *    namespace from one machine without having to constantly switch between keys.
 * @returns {Promise<string>}
 */
export const findApiKey = async (namespace) => {
  const namespaceSpecificKeyInEnvironment =
    namespace &&
    process.env[`${environmentVariableName}_${namespace.toUpperCase()}`];

  if (namespaceSpecificKeyInEnvironment) {
    console.log(
      chalk.green(`Found API key in environment (specific to ${namespace}).`),
    );
    return namespaceSpecificKeyInEnvironment;
  }

  const keyInEnvironment = process.env[environmentVariableName];

  if (keyInEnvironment) {
    console.log(chalk.green("Found API key in environment."));
    return keyInEnvironment;
  }

  const existingConfigFilePath = await findUp(configFileName);
  if (existingConfigFilePath) {
    return extractKeyFromRcFile(existingConfigFilePath, namespace);
  }

  printSpacer();
  console.log(chalk.red("No API key found."));
  console.log(
    chalk.bold("Please either:\n"),
    `  - set ${environmentVariableName} in the environment\n`,
    `  - create a a file named ${configFileName} at the project root containing ${configFileKey}=your-api-key`,
  );

  const projectRootPath = await findProjectRoot();
  if (projectRootPath) {
    const agreement = await doesUserAgree(
      `Would you like a ${configFileName} created at the project root?`,
    );
    if (agreement) {
      const newConfigFilePath = path.resolve(projectRootPath, configFileName);
      fs.writeFileSync(newConfigFilePath, configFileTemplate);
      console.log(chalk.green("Created file:"), newConfigFilePath);
      console.log(
        chalk.red("Warning:"),
        "you should add .blockprotocolrc to your .gitignore to avoid committing your secret",
      );
    }
  }

  printSpacer();
  process.exit(1);
};
