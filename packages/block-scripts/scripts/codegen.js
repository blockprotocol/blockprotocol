import { writeFileSync } from "node:fs";
import path, { join } from "node:path";

import { generateTypeScriptFromEntityType } from "@blockprotocol/graph/codegen";
import { validateVersionedUri } from "@blockprotocol/type-system/slim";
import chalk from "chalk";
import fs from "fs-extra";

import { blockRootDirPath } from "../shared/paths.js";

const script = async () => {
  const packageJsonPath = path.resolve(blockRootDirPath, "./package.json");

  const {
    blockprotocol: { schema },
  } = await fs.readJson(packageJsonPath);

  if (!schema) {
    console.error(
      chalk.red(
        "package.json must contain a 'schema' key in 'blockprotocol' object",
      ),
    );
    process.exit(1);
  }

  const validationResult = validateVersionedUri(schema);
  if (validationResult.type === "Err") {
    console.error(
      chalk.red(`Invalid 'schema' URI: ${validationResult.inner.reason}`),
    );
    process.exit(1);
    return;
  }
  const { typeScriptString } = await generateTypeScriptFromEntityType(
    validationResult.inner,
    2, // @todo blocks should be able to statically declare desired subgraph depth from EA
  );

  const generatedFilePath = join(blockRootDirPath, "src", "types.gen.ts");

  writeFileSync(generatedFilePath, typeScriptString);
};

await script();
