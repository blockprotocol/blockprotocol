import * as help from "./commands/help.js";
import * as publish from "./commands/publish.js";

/** @type {Record<string, { run: (options?: import("command-line-args").CommandLineOptions) => void; options?: import("command-line-args").OptionDefinition[]; manual?: import("command-line-usage").Section[]}>} */
export const commandLookup = {
  help,
  publish,
};
