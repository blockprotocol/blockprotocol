#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

import { commands } from "./cli/commands.js";
import { printErrorMessage } from "./cli/print-error-message.js";

const availableCommands = Object.keys(commands);

(async () => {
  // parse the first argument - the command
  const { _unknown: optionsArgv, command } = commandLineArgs(
    {
      name: "command",
      defaultOption: true,
    },
    {
      stopAtFirstUnknown: true,
    },
  );

  // print help for the CLI if requested or if the command is unknown
  const printHelp = commands.help.script;
  if (command === "help" || !command) {
    printHelp();
    process.exit();
  }
  if (!availableCommands.includes(command)) {
    printHelp();
    printErrorMessage(`unknown command '${command ?? ""}'`);
    process.exit();
  }

  // parse the remaining arguments – the options
  const { _unknown: unknownOption, ...options } = commandLineArgs(
    commands[command].options,
    {
      argv: optionsArgv ?? [],
      stopAtFirstUnknown: true,
    },
  );

  // print help for the given command if requested or usage is incorrect
  const commandManual = commandLineUsage(commands[command].manual);
  if (options.help) {
    console.log(commandManual);
    process.exit();
  }
  if (unknownOption) {
    console.log(commandManual);
    printErrorMessage(`unknown option '${unknownOption}'`);
    process.exit();
  }

  // execute the requested command with the given options, if any
  commands[command].script(options);
})();
