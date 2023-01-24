#!/usr/bin/env node

/* eslint-disable no-console */

const { promisify } = require("node:util");
const child_process = require("node:child_process");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const fs = require("fs-extra");
const pacote = require("pacote");
const path = require("node:path");
const slugify = require("slugify");
const untildify = require("untildify");

const {
  helpSections,
  commandLineArguments,
  availableTemplates,
} = require("./command-line-arguments");

const exec = promisify(child_process.exec);

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

  if (
    !availableTemplates.find(
      (option) => template === option || template.startsWith(`${option}@`),
    )
  ) {
    console.error(
      `Requested template '${template}' is invalid. Please choose one of ${availableTemplates.join(
        ", ",
      )}`,
    );
    process.exit(1);
  }

  // @todo: replace with `path ?? name` after dropping Node 12 support
  const folderPath = blockPath || slugifiedBlockName;

  const resolvedBlockPath = path.resolve(untildify(folderPath));

  try {
    await fs.stat(resolvedBlockPath);
    console.error(
      `${resolvedBlockPath} already exists, please specify another path!`,
    );
    process.exit();
  } catch {
    // noop (we expect stat to fail)
  }

  const tempExtractionDir = path.join(resolvedBlockPath, "tmp");

  const templatePackageName = `block-template-${template}`;
  console.log(`Downloading package ${templatePackageName}...`);

  await pacote.extract(templatePackageName, tempExtractionDir, {
    registry: process.env.NPM_CONFIG_REGISTRY,
  });

  console.log("Updating files...");

  await fs.copy(
    path.resolve(tempExtractionDir),
    path.resolve(resolvedBlockPath),
  );
  await fs.rm(tempExtractionDir, { recursive: true });

  try {
    await fs.rename(
      path.resolve(resolvedBlockPath, ".gitignore.dist"),
      path.resolve(resolvedBlockPath, ".gitignore"),
    );
  } catch {
    // noop (template is missing .gitignore.dist)
  }

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = slugifiedBlockName;
  packageJson.version = "0.0.0";
  packageJson.description = `${blockName} block`;

  const blockMetadataPath = `${resolvedBlockPath}/block-metadata.json`;
  const blockMetadata =
    template === "html" ? await fs.readJson(blockMetadataPath) : undefined;

  if (template === "html") {
    blockMetadata.displayName = blockName;
    blockMetadata.name = slugifiedBlockName;
  } else {
    packageJson.blockprotocol.displayName = blockName;
    packageJson.blockprotocol.name = slugifiedBlockName;
  }

  delete packageJson.homepage;
  delete packageJson.repository;

  if (template === "custom-element") {
    packageJson.blockprotocol.blockType.tagName = slugifiedBlockName;
  }

  try {
    const gitConfigUserNameResult = await exec("git config --get user.name");
    const userName = gitConfigUserNameResult.stdout.trim();
    packageJson.author = userName;

    if (template === "html") {
      blockMetadata.author = userName;
    }
  } catch {
    delete packageJson.author;

    if (template === "html") {
      delete blockMetadata.author;
    }
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  if (template === "html") {
    await fs.writeJson(blockMetadataPath, blockMetadata, { spaces: 2 });
  }

  const chalk = (await import("chalk")).default;

  const relativeBlockPath = path.relative(process.cwd(), resolvedBlockPath);

  const escapedPath = !/[^%+,-./:=@_0-9A-Za-z]/.test(relativeBlockPath)
    ? relativeBlockPath
    : `'${relativeBlockPath.replace(/'/g, `'"'`)}'`;

  console.log(
    chalk.bold("-".repeat(Math.min(process.stdout.columns ?? 48, 48))),
  );
  console.log(
    `Your ${chalk.bold(blockName)} block is ready to code in ${chalk.bold(
      resolvedBlockPath,
    )}\n` +
      `Run ${chalk.blue(`cd ${escapedPath}`)} and then \n` +
      `${chalk.blue("yarn install && yarn dev")} or ${chalk.blue(
        "npm install && npm run dev",
      )} to get started`,
  );
})();
