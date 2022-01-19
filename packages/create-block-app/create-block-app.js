#!/usr/bin/env node

/* eslint-disable no-console */

const { promisify } = require("util");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const tmp = require("tmp");
const decompress = require("decompress");

const exec = promisify(child_process.exec);

const templatePackageName = "block-template";

(async () => {
  const blockName = process.argv[2];

  if (!blockName) {
    console.error("Please supply block name");
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

  console.log("Downloading template...");

  const tmpDir = tmp.dirSync({ unsafeCleanup: true });

  const npmPackResult = await exec(
    `npm pack ${templatePackageName} --pack-destination ${tmpDir.name}`,
  );
  const tgzFileName = npmPackResult.stdout.trim();

  console.log("Copying files...");
  fs.mkdirSync(resolvedBlockPath, { recursive: true });
  await decompress(path.resolve(tmpDir.name, tgzFileName), resolvedBlockPath, {
    strip: 1,
  });
  tmpDir.removeCallback();

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.name = blockName;
  packageJson.version = "0.0.0";
  packageJson.description = `${blockName} block`;
  delete packageJson.homepage;
  delete packageJson.repository;

  try {
    const gitConfigUserNameResult = await exec("git config --get user.name");
    packageJson.author = gitConfigUserNameResult.stdout.trim();
  } catch {
    delete packageJson.author;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

  console.log(
    `Your ${blockName} block is ready to code in ${resolvedBlockPath}`,
  );
})();
