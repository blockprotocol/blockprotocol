import path from "node:path";

import {
  codegen,
  validateCodegenParameters,
} from "@blockprotocol/graph/codegen";
import chalk from "chalk";
import fs from "fs-extra";

import { blockRootDirPath } from "../shared/paths.js";

const script = async () => {
  const packageJsonPath = path.resolve(blockRootDirPath, "./package.json");

  const {
    blockprotocol: { blockEntityType, codegen: codegenParams },
  } = await fs.readJson(packageJsonPath);

  if (!codegenParams) {
    console.error(
      chalk.red(
        "package.json must contain a 'codegen' key in 'blockprotocol' object, see https://blockprotocol.org/docs/working-with-types#typescript-types-for-entities for more details",
      ),
    );
    process.exit(1);
  }

  /**
   * For block author ergonomics, we only require them to define their block entity type in one place.
   * As such, this loops through the codegen parameters and replace the `"blockEntityType": true` placeholder with the
   * `blockEntityType` field. We do this recursively and naively as we want to benefit from the Codegen validation
   * function, so we can't be sure of the structure right now.
   *
   * @param {any} obj
   */
  const replaceBlockEntityTypePlaceholder = (obj) => {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        replaceBlockEntityTypePlaceholder(obj[i]);
      }
    } else if (obj instanceof Object) {
      for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
          if (prop === "blockEntityType" && obj[prop] === true) {
            if (!blockEntityType) {
              console.error(
                chalk.red(
                  "to generate code for the block entity type, package.json must contain a 'blockEntityType' key in 'blockprotocol' object",
                ),
              );
              process.exit(1);
            }
            /* eslint-disable no-param-reassign */
            obj.sourceTypeId = blockEntityType;
            obj.blockEntity = true;
            delete obj[prop];
            /* eslint-enable no-param-reassign */
          } else {
            replaceBlockEntityTypePlaceholder(obj[prop]);
          }
        }
      }
    }
    return obj;
  };

  replaceBlockEntityTypePlaceholder(codegenParams);

  const { errors } = validateCodegenParameters(codegenParams) ?? {};

  if (errors && errors.length > 0) {
    console.error(
      chalk.red(`codegen parameters are invalid:\n${errors.join("\n")}`),
    );
    process.exit(1);
  }

  const filesWithBlockEntityDefinitions = [];
  for (const [fileName, sources] of Object.entries(codegenParams.targets)) {
    for (const source of sources) {
      if (source.blockEntity) {
        filesWithBlockEntityDefinitions.push(fileName);
      }
    }
  }

  if (filesWithBlockEntityDefinitions.length > 1) {
    console.error(
      chalk.red(
        `codegen parameters are invalid: only one set of type can be generated for the \`blockEntityType\`. Found definitions in multiple files: [${filesWithBlockEntityDefinitions.join(
          ", ",
        )}]`,
      ),
    );
    process.exit(1);
  }

  /* @todo - optionally take a log level in from command-line or environment */
  const affectedFiles = await codegen(codegenParams);
  // Output a space-separated list of affected files on stdout so that it can be piped into other tooling
  console.log(affectedFiles.join(" "));
};

await script();
