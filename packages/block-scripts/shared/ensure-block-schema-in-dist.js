import * as TJS from "typescript-json-schema";
import fs from "fs-extra";
import path from "path";
import { blockDistDirPath, blockRootDirPath } from "./paths.js";

export const ensureBlockSchemaInDist = async () => {
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
    await fs.writeJson(blockSchemaInDistFilePath, schema, { spaces: 2 });
  } catch (error) {
    console.warn(`Unable to generate block-schema: ${error}`);
  }
};
