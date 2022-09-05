import chalk from "chalk";
import fs from "fs-extra";
import path from "node:path";
import slugify from "slugify";
import tar from "tar";
import tmp from "tmp-promise";

import { printSpacer } from "../print-spacer.js";
import { doesUserAgree } from "./publish/does-user-agree.js";
import { findApiKey } from "./publish/find-api-key.js";
import { findBlockFolder } from "./publish/find-block-folder.js";
import { postPublishForm } from "./publish/post-form.js";

// ********************* MANUAL ********************* //

const manual = [
  {
    header: "blockprotocol publish",
    content:
      "Publish a block to the Block Protocol hub. See https://blockprotocol.org/docs",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "dry",
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
    ],
  },
];

// ********************* OPTIONS ********************* //

const optionsGuide = manual.find(({ header }) => header === "Options");
const options = optionsGuide.optionList;

// ********************* SCRIPT ********************* //

/**
 * Publishes to the Block Protocol hub
 * @param {object} [providedOptions]
 * @param {string} [providedOptions.path]
 * @param {boolean} [providedOptions.dry]
 */
const script = async (providedOptions) => {
  const { path: providedPath, dry, tmp: tmpDir } = providedOptions ?? {};

  const apiKey = await findApiKey();

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
  } catch (err) {
    console.log(
      `Could not parse block-metadata.json: ${chalk.red(err.message)}`,
    );
    process.exit();
  }

  const blockName = metadataJson.name;
  if (!blockName) {
    console.log(
      `block-metadata.json does ${chalk.red("not")} contain 'name' key`,
    );
    process.exit();
  } else if (!/^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/.test(blockName)) {
    console.log(
      `'name' in block-metadata.json must be a slug. Try updating it to '${slugify(
        blockName,
        { lower: true, strict: true },
      )}'`,
    );
    process.exit();
  }

  console.log(
    chalk.bgYellow(`Ready to publish block '${chalk.underline(blockName)}'`),
  );

  if (dry) {
    console.log("Dry run, exiting.");
    process.exit();
  }

  const shouldProceed = await doesUserAgree("Continue with publishing?");

  if (!shouldProceed) {
    console.log("Publishing cancelled.");
    process.exit();
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
  }).catch((err) => console.error(err));

  printSpacer();

  if (errors) {
    const errorMsg = errors[0].msg;
    console.log(chalk.red(errorMsg));
    process.exit();
  }

  const blockUrl = `${blockProtocolSiteHost}${block.blockSitePath}`;

  console.log(
    chalk.bgGreen(`Successfully published '${chalk.underline(blockName)}'!`),
  );
  console.log(`Visit ${chalk.underline(blockUrl)} to see it on the Block Hub`);

  await cleanup();

  process.exit();
};

// ********************* EXPORTS ********************* //

export { manual, options, script };
