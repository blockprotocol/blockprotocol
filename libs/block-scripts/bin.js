#!/usr/bin/env node
import { URL } from "node:url";

import chalk from "chalk";
import parser from "yargs-parser";

import { listAvailableScriptNames } from "./shared/list-available-script-names.js";

const scriptConfig = parser(process.argv.slice(2));
const scriptName = scriptConfig.help
  ? "help"
  : `${scriptConfig._.shift() ?? "help"}`.toLowerCase();

const availableScriptNames = await listAvailableScriptNames();

if (!availableScriptNames.includes(scriptName)) {
  console.log(
    `Unrecognised script ${chalk.red(
      scriptName,
    )}. Available scripts: ${availableScriptNames
      .map((availableScriptName) => chalk.blue(availableScriptName))
      .join(", ")}`,
  );
  process.exit(1);
}

process.env.SCRIPT_CONFIG = JSON.stringify(scriptConfig);
const scriptModuleUrl = new URL(`./scripts/${scriptName}.js`, import.meta.url);

await import(scriptModuleUrl.toString());
