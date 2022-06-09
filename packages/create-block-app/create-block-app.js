#!/usr/bin/env node

/* eslint-disable no-console */

const { promisify } = require("util");
const child_process = require("child_process");
const fs = require("fs");
const pacote = require("pacote");
const path = require("path");
const untildify = require("untildify");

const exec = promisify(child_process.exec);

const templatePackageName = "block-template";

(async () => {
  const blockName = process.argv[2];

  if (!blockName) {
    console.error("Please supply block name");
    process.exit();
  }

  // @todo: replace with `process.argv[3] ?? blockName` after dropping Node 12 support
  const blockPath = process.argv[3] ? process.argv[3] : blockName;

  const resolvedBlockPath = path.resolve(untildify(blockPath));

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

  await pacote.extract(templatePackageName, resolvedBlockPath, {
    registry: process.env.NPM_CONFIG_REGISTRY,
    defaultTag: "beta",
  });

  console.log("Updating files...");
  try {
    fs.renameSync(
      path.resolve(resolvedBlockPath, ".gitignore.dist"),
      path.resolve(resolvedBlockPath, ".gitignore"),
    );
  } catch {
    // noop (template is missing .gitignore.dist)
  }

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.name = blockName;
  packageJson.version = "0.0.0";
  packageJson.description = `${blockName} block`;
  packageJson.blockprotocol.displayName = blockName;
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
