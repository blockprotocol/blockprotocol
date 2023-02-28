import { writeFileSync } from "node:fs";
import path, { join } from "node:path";
import chalk from "chalk";
import fs from "fs-extra";
import { entityTypeToTypeScript } from "../src/shared/codegen/entity-type-to-typescript";
import { fetchAndValidateEntityType } from "../src/temporal/codegen";

const genDir = path.resolve(".", "src", "shared", "types", "generated");

const script = async () => {
  console.log(chalk.bold(`Generating code in ${genDir}`));
  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir, {});
  }

  const remoteFileEntityTypeId =
    "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/file-locator/v/2";

  const entityTypeSchema = await fetchAndValidateEntityType(
    remoteFileEntityTypeId,
  );

  const { typeScriptString } = await entityTypeToTypeScript(
    entityTypeSchema,
   true,
    0,
  );

  /*
   * @todo - This is fairly flakey, but modifying the inner functions to figure out the relative import path will be
   *   difficult
   */

  typeScriptString.replace(`import { Entity, JsonObject } from "@blockprotocol/graph/temporal"`, `import { JsonObject } from "@blockprotocol/graph/temporal"`)
  console.log({ genDir });
  const generatedFilePath = join(genDir, `file.gen.ts`);

  writeFileSync(generatedFilePath, typeScriptString);
};

await script();
