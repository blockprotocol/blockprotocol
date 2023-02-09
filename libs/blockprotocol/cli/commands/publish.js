import path from "node:path";

import chalk from "chalk";
import fs from "fs-extra";
import slugify from "slugify";
import tar from "tar";
import tmp from "tmp-promise";

import { printSpacer } from "../shared/print-spacer.js";
import { doesUserAgree } from "./publish/does-user-agree.js";
import { findApiKey } from "./publish/find-api-key.js";
import { findBlockFolder } from "./publish/find-block-folder.js";
import { postPublishForm } from "./publish/post-form.js";

// ********************* MANUAL ********************* //

/**
 * @type {[import("command-line-usage").Content, import("command-line-usage").OptionList]}
 */
const manual = [
  {
    header: "blockprotocol publish",
    content:
      "Publish a block on the Block Protocol Hub. See https://blockprotocol.org/docs",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "dry-run",
        alias: "d",
        type: Boolean,
        typeLabel: "{underline string}",
        description: "Dry run: validates process without actually publishing",
      },
      {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Print this usage guide",
      },
      {
        name: "path",
        alias: "p",
        type: String,
        typeLabel: "{underline string}",
        description:
          "Specify a path to your block's distribution folder.\nDefaults to looking for a folder containing block-metadata.json, first looking (1) within the cwd and then (2) from the project root.",
      },
      {
        name: "tmp",
        alias: "t",
        type: String,
        typeLabel: "{underline string}",
        description:
          "Specify a path to use for temporary file storage. If omitted, uses OS default.",
      },
      {
        name: "yes",
        alias: "y",
        type: Boolean,
        description:
          "Automatically publish if checks pass, without waiting for confirmation.",
      },
    ],
  },
];

// ********************* OPTIONS ********************* //

const options = manual[1].optionList;

// *********************** RUN *********************** //

/**
 * Publishes on the Block Protocol hub
 * @param {import("command-line-args").CommandLineOptions | undefined} providedOptions
 */
const run = async (providedOptions) => {
  const { path: providedPath, tmp: tmpDir, yes } = providedOptions ?? {};
  const dryRun = providedOptions?.["dry-run"];

  const blockFolderPath = providedPath ?? (await findBlockFolder());

  const metadataPath = path.resolve(blockFolderPath, "block-metadata.json");
  const metadataExists = await fs.pathExists(metadataPath);
  if (!metadataExists) {
    printSpacer();
    console.log(
      `block-metadata.json ${chalk.red(
        "not found",
      )} in provided directory path`,
    );
    console.log(`Checked: ${metadataPath}`);
    printSpacer();
    process.exit();
  }

  console.log(chalk.green(`Found block files in ${blockFolderPath}`));

  let metadataJson;
  try {
    metadataJson = await fs.readJson(metadataPath);
  } catch (error) {
    console.log(
      `Could not parse block-metadata.json: ${chalk.red(
        error instanceof Error ? error.message : error,
      )}`,
    );
    process.exit();
  }

  const blockName = metadataJson.name;

  if (!blockName) {
    console.log(
      `block-metadata.json does ${chalk.red("not")} contain 'name' key`,
    );
    process.exit();
  }

  const { blockNamespace, blockNameWithoutNamespace } =
    blockName.match(
      /^(@(?<blockNamespace>[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*)\/)?(?<blockNameWithoutNamespace>[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*)$/,
    )?.groups ?? {};

  console.log(blockNamespace, blockNameWithoutNamespace);

  if (!blockNameWithoutNamespace) {
    if (!blockNamespace) {
      console.log(
        `'name' in block-metadata.json must be a slug. Try updating it to '${slugify(
          blockName,
          { lower: true, strict: true },
        )}'`,
      );
    } else {
      console.log(
        `'name' in block-metadata.json must be a slug or defined as '@namespace/block-name' (all lowercase). Current value: '${blockName}'`,
      );
    }
    process.exit();
  }

  const apiKey = await findApiKey(blockNamespace);

  console.log(
    chalk.bgYellow(`Ready to publish block '${chalk.underline(blockName)}'`),
  );

  if (dryRun) {
    console.log("Dry run, exiting.");
    process.exit();
  }

  if (!yes) {
    const shouldProceed = await doesUserAgree("Continue with publishing?");

    if (!shouldProceed) {
      console.log("Publishing cancelled.");
      process.exit();
    }
  }

  const { path: tarballFolder, cleanup } = await tmp.dir({
    tmpdir: tmpDir || undefined, // we don't want to use empty strings either
    unsafeCleanup: true,
  });
  const tarballFilePath = path.resolve(tarballFolder, "block-files.tar.gz");

  await tar.c({ cwd: blockFolderPath, file: tarballFilePath }, ["."]);

  const blockProtocolSiteHost =
    process.env.BLOCK_PROTOCOL_SITE_HOST ?? "https://blockprotocol.org";

  const { errors, block } = await postPublishForm({
    blockProtocolSiteHost,
    tarballFilePath,
    blockName,
    apiKey,
  });

  printSpacer();

  if (errors || !block) {
    const errorMsg = errors?.[0]?.msg;
    console.log(chalk.red(errorMsg));
    process.exit();
  }

  const blockUrl = `${blockProtocolSiteHost}${block.blockSitePath}`;

  console.log(
    chalk.bgGreen(`Successfully published '${chalk.underline(blockName)}'!`),
  );
  console.log(`Visit ${chalk.underline(blockUrl)} to see it on the Hub`);

  await cleanup();

  process.exit();
};

// ********************* EXPORTS ********************* //

export { manual, options, run };
