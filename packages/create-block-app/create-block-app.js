#!/usr/bin/env node

/* eslint-disable no-console */

const { promisify } = require("util");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const unpack = require("tar-pack").unpack;

const exec = promisify(child_process.exec);

(async () => {
  const blockName = process.argv[2];

  if (!blockName) {
    console.error("Please supply block name the script.");
    process.exit();
  }

  const blockPath = process.argv[3] ?? blockName;

  const resolvedBlockPath = path.resolve(blockPath);

  try {
    fs.statSync(resolvedBlockPath);
    console.error(
      `${resolvedBlockPath} already exists, please specify another path!`,
    );
    process.exit();
  } catch {
    // noop (we expect statSync to fail)
  }

  console.log("Copying required files...");

  fs.mkdirSync(path.dirname(resolvedBlockPath), { recursive: true });

  // TODO: Replace with ‘download and unpack npm package’
  await exec(`cp -R ${__dirname}/../../block-template ${resolvedBlockPath}`);

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.name = blockName;
  packageJson.description = `${blockName} block`;

  try {
    const { stdout } = await exec("git config --get user.name");
    packageJson.author = stdout.trim();
  } catch {
    delete packageJson.author;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

  console.log(
    `Your ${blockName} block is ready to code in ${resolvedBlockPath}`,
  );
})();
