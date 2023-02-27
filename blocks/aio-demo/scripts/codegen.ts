import { writeFileSync } from "node:fs";
import path, { join } from "node:path";

import { generateTypeScriptFromEntityType } from "@blockprotocol/graph/codegen";
import { validateVersionedUrl } from "@blockprotocol/type-system";
import chalk from "chalk";
import fs from "fs-extra";

const genDir = path.resolve(".", "src", "types", "entity-types");

const generateTypesForEntityType = async (
  fileName: string,
  entityTypeId: string,
  depth = 2,
) => {
  const validationResult = validateVersionedUrl(entityTypeId);
  if (validationResult.type === "Err") {
    console.error(
      chalk.red(`Invalid entityTypeId: ${validationResult.inner.reason}`),
    );
    process.exit(1);
    return;
  }

  const { typeScriptString } = await generateTypeScriptFromEntityType(
    validationResult.inner,
    depth,
  );

  console.log({ genDir });
  const generatedFilePath = join(genDir, `${fileName}.gen.ts`);

  writeFileSync(generatedFilePath, typeScriptString);
};

const script = async () => {
  console.log(chalk.bold("Generating code..."));

  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir, {});
  }

  for (const { fileName, entityTypeId } of [
    {
      fileName: "organization",
      entityTypeId:
        "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2",
    },
    {
      fileName: "person",
      entityTypeId:
        "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3",
    },
  ]) {
    await generateTypesForEntityType(fileName, entityTypeId);
  }
};

await script();
