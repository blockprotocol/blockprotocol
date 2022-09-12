#!/usr/bin/env node

import chalk from "chalk";
import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

import { commandLookup } from "./cli/commands.js";
import { run as printHelp } from "./cli/commands/help.js";
import { printSpacer } from "./cli/print-spacer.js";

/**
 * @param {string} errorMessage
 */
const printErrorMessage = (errorMessage) => {
  console.log(chalk.red(`${errorMessage}. Please check usage.`));
  printSpacer();
};

(async () => {
  // parse the first argument - the command
  const { _unknown: optionsArgv, command } = commandLineArgs(
    [
      {
        name: "command",
        defaultOption: true,
      },
    ],
    {
      stopAtFirstUnknown: true,
    },
  );

  // print help for the CLI if requested or if the command is unknown
  if (command === "help" || !command) {
    printHelp();
    process.exit();
  }

  const foundCommand = commandLookup[command];

  if (!foundCommand) {
    printHelp();
    printErrorMessage(`Unknown command '${command ?? ""}'`);
    process.exit();
  }

  // parse the remaining arguments – the options
  const { _unknown: unknownOption, ...options } = commandLineArgs(
    foundCommand.options ?? [],
    {
      argv: optionsArgv ?? [],
      stopAtFirstUnknown: true,
    },
  );

  // print help for the given command if requested or usage is incorrect
  const commandManual = commandLineUsage(foundCommand.manual ?? []);
  if (options.help) {
    console.log(commandManual);
    process.exit();
  }
  if (unknownOption) {
    console.log(commandManual);
    printErrorMessage(`Unknown option '${unknownOption}'`);
    process.exit();
  }

  // execute the requested command with the given options, if any
  foundCommand.run(options);
})();
