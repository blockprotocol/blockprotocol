#!/usr/bin/env node
import { URL, fileURLToPath } from "node:url";
import parser from "yargs-parser";
import fs from "fs-extra";
import path from "node:path";

const knownScriptNames = (
  await fs.readdir(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "scripts"),
  )
).map((scriptFileName) => path.basename(scriptFileName, ".mjs"));

const scriptConfig = parser(process.argv.slice(2));
const scriptName = scriptConfig.help
  ? "help"
  : (scriptConfig._.shift() ?? "help").toLowerCase();

if (!knownScriptNames.includes(scriptName)) {
  console.log(
    `Unrecognised script ${scriptName}. Supported scripts: ${knownScriptNames.join(
      ", ",
    )}.`,
  );
  process.exit(1);
}

process.env.SCRIPT_CONFIG = JSON.stringify(scriptConfig);
const scriptModuleUrl = new URL(`./scripts/${scriptName}.mjs`, import.meta.url);
await import(scriptModuleUrl);
