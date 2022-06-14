#!/usr/bin/env node

/* eslint-disable no-console */

const { promisify } = require("util");
const child_process = require("child_process");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const fs = require("fs-extra");
const pacote = require("pacote");
const path = require("path");
const slugify = require("slugify");
const untildify = require("untildify");

const {
  helpSections,
  commandLineArguments,
  availableTemplates,
} = require("./command-line-arguments");

const exec = promisify(child_process.exec);

const templatePackageName = "block-template";

const usage = commandLineUsage(helpSections);

(async () => {
  const options = commandLineArgs(commandLineArguments, {
    stopAtFirstUnknown: true,
  });

  const { help, name: blockName, path: blockPath, _unknown } = options;

  const template = options.template.toLowerCase();

  if (_unknown) {
    console.log(usage);
    console.error(
      "************************************************************************",
    );
    console.error(
      `Exited due to unknown argument '${_unknown}'. Please see examples above.`,
    );
    console.error(
      "************************************************************************",
    );
    process.exit();
  }

  if (help) {
    console.log(usage);
    process.exit();
  }

  if (!blockName) {
    console.log(usage);
    console.error("Please supply block name, e.g. create-block-app my-block");
    process.exit();
  }

  const slugifiedBlockName = slugify(blockName, { lower: true, strict: true });

  if (!availableTemplates.includes(template)) {
    console.error(
      `Requested template '${template}' is invalid. Please choose one of ${availableTemplates.join(
        ", ",
      )}`,
    );
    process.exit();
  }

  // @todo: replace with `path ?? name` after dropping Node 12 support
  const folderPath = blockPath || slugifiedBlockName;

  const resolvedBlockPath = path.resolve(untildify(folderPath));

  try {
    fs.statSync(resolvedBlockPath);
    console.error(
      `${resolvedBlockPath} already exists, please specify another path!`,
    );
    process.exit();
  } catch {
    // noop (we expect statSync to fail)
  }

  const tempExtractionDir = path.join(resolvedBlockPath, "tmp");

  console.log("Downloading template...");

  await pacote.extract(templatePackageName, tempExtractionDir, {
    registry: process.env.NPM_CONFIG_REGISTRY,
  });

  const templatePath = path.join(tempExtractionDir, "templates", template);
  try {
    fs.statSync(templatePath);
  } catch {
    console.error(
      `Template '${template}' is missing – please raise an issue at https://github.com/blockprotocol/blockprotocol/issues`,
    );
    process.exit();
  }

  console.log("Updating files...");

  fs.copySync(path.resolve(templatePath), path.resolve(resolvedBlockPath));
  fs.rm(tempExtractionDir, { recursive: true });

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.name = slugifiedBlockName;
  packageJson.version = "0.0.0";
  packageJson.description = `${blockName} block`;
  packageJson.blockprotocol.displayName = blockName;
  delete packageJson.homepage;
  delete packageJson.repository;

  if (template === "custom-element") {
    packageJson.blockprotocol.blockType.tagName = slugifiedBlockName;
  }

  try {
    const gitConfigUserNameResult = await exec("git config --get user.name");
    packageJson.author = gitConfigUserNameResult.stdout.trim();
  } catch {
    delete packageJson.author;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

  console.log(
    `Your ${blockName} block is ready to code in ${resolvedBlockPath}.\nRun 'yarn install && yarn dev' to get started`,
  );
})();
