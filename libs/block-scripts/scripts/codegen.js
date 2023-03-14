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
    blockprotocol: { codegen: codegenParams },
  } = await fs.readJson(packageJsonPath);

  if (!codegenParams) {
    console.error(
      chalk.red(
        "package.json must contain a 'codegen' key in 'blockprotocol' object",
      ),
    );
    process.exit(1);
  }

  const { errors } = validateCodegenParameters(codegenParams) ?? {};

  if (errors && errors.length > 0) {
    console.error(
      chalk.red(`codegen parameters are invalid:\n${errors.join("\n")}`),
    );
    process.exit(1);
  }

  const blockEntityDefinitions = [];
  for (const sources of Object.values(codegenParams.targets)) {
    for (const source of sources) {
      if (source.blockEntity) {
        blockEntityDefinitions.push(source.sourceTypeId);
      }
    }
  }

  if (blockEntityDefinitions.length > 1) {
    console.error(
      chalk.red(
        `codegen parameters are invalid: only one type can be defined as the \`blockEntity\`. Found multiple: [${blockEntityDefinitions.join(
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
