import fs from "fs-extra";
import path from "node:path";
import * as TJS from "typescript-json-schema";

import { blockDistDirPath, blockRootDirPath } from "./paths.js";
import { writeFormattedJson } from "./write-formatted-json.js";

export const generateDistBlockSchema = async () => {
  const blockSchemaInDistFilePath = path.resolve(
    blockDistDirPath,
    "block-schema.json",
  );

  const customBlockSchemaFilePath = path.resolve(
    blockRootDirPath,
    "block-schema.json",
  );

  if (await fs.pathExists(customBlockSchemaFilePath)) {
    await fs.copy(customBlockSchemaFilePath, blockSchemaInDistFilePath);
    console.log("Using custom block-schema.json");
    return;
  }

  try {
    const tsconfigFilePath = path.resolve(blockRootDirPath, "tsconfig.json");
    const program = TJS.programFromConfig(tsconfigFilePath);

    /** @type {import("typescript-json-schema").PartialArgs} */
    const settings = {
      required: true,
    };

    const schema = TJS.generateSchema(program, "AppProps", settings);
    await fs.ensureDir(blockDistDirPath);
    await writeFormattedJson(blockSchemaInDistFilePath, schema);
  } catch (error) {
    console.warn(`Unable to generate block-schema: ${error}`);
    await writeFormattedJson(blockSchemaInDistFilePath, {});
  }
};
