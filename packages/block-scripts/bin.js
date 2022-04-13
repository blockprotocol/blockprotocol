#!/usr/bin/env node
import { URL, fileURLToPath } from "node:url";
import parser from "yargs-parser";
import fs from "node:fs/promises";
import path from "node:path";

const knownScriptNames = (
  await fs.readdir(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "scripts"),
  )
).map((scriptFileName) => path.basename(scriptFileName, ".js"));

const argv = parser(process.argv.slice(2));
const scriptName = (argv._.shift() ?? "help").toLowerCase();

if (!knownScriptNames.includes(scriptName)) {
  console.log(
    `Unrecognised script ${scriptName}. Supported scripts: ${knownScriptNames.join(
      ", ",
    )}.`,
  );
  process.exit(1);
}

process.env.SCRIPT_ARGV = JSON.stringify(argv);
const scriptModuleUrl = new URL(`./scripts/${scriptName}.js`, import.meta.url);
await import(scriptModuleUrl);
