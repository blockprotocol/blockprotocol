import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import tmp from "tmp-promise";
import treeKill from "tree-kill";
import untildify from "untildify";
import waitOn from "wait-on";

import { logStepEnd, logStepStart } from "./shared/logging";

/**
 * Calling `execa.kill()` does not terminate processes recursively on Ubuntu.
 * Using `killProcessTree` helps avoid hanging processes.
 *
 * Anonymous function is used inside promisify because promisify(treeKill)
 * produces incomplete typings.
 *
 * @see https://github.com/sindresorhus/execa/issues/96
 *      https://github.com/nodejs/node/issues/40438
 */
const killProcessTree = promisify(
  (pid: number, sig: string, callback: () => void) =>
    treeKill(pid, sig, callback),
);

const defaultExecaOptions = {
  env: {
    NODE_ENV: "development",
    NPM_CONFIG_REGISTRY: process.env.NPM_CONFIG_REGISTRY,
    PATH: process.env.PATH,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

const script = async () => {
  console.log(chalk.bold("Smoke-testing create-block-app..."));

  const tmpNodeCacheDir = await tmp.dir({ unsafeCleanup: true });

  const blockName = process.env.BLOCK_NAME ?? "test-block";
  const blockTemplate = process.env.BLOCK_TEMPLATE;
  const userDefinedBlockDirPath = process.env.BLOCK_DIR_PATH;

  const tmpBlockParentDir = userDefinedBlockDirPath
    ? undefined
    : await tmp.dir({ unsafeCleanup: true });

  const blockDirPath = tmpBlockParentDir
    ? path.join(tmpBlockParentDir?.path, blockName)
    : userDefinedBlockDirPath!;

  const resolvedBlockDirPath = path.resolve(untildify(blockDirPath));

  const fileNames = (await fs.readdir(blockDirPath).catch(() => {})) ?? [];

  if (fileNames.length) {
    throw new Error(
      `Unable to use ${blockDirPath} as block directory because it is not empty`,
    );
  }

  try {
    logStepStart("Create Block App");

    const result = await execa(
      "npx",
      [
        "--cache",
        tmpNodeCacheDir.path,
        "create-block-app",
        blockName,
        "--path",
        blockDirPath,
        ...(blockTemplate ? [`--template=${blockTemplate}`] : []),
      ],
      {
        ...defaultExecaOptions,
        reject: false,
        cwd: os.tmpdir(),
      },
    );

    if (
      !blockTemplate ||
      ["custom-element", "html", "react"].includes(blockTemplate)
    ) {
      if (result.exitCode) {
        throw new Error(`Unexpected exit code ${result.exitCode}`);
      }
    } else {
      if (!result.exitCode) {
        throw new Error(`Expected non-zero exit code`);
      }
      return;
    }

    logStepEnd();
    logStepStart("Check folder structure");

    for (const relativePath of [".npmignore", "dist", "dev/src"]) {
      if (
        await fs.pathExists(path.resolve(resolvedBlockDirPath, relativePath))
      ) {
        throw new Error(
          `Unexpected to find \`${relativePath}\` in the published block template`,
        );
      }
    }

    logStepEnd();
    logStepStart("Install dependencies");

    const execaOptionsInBlockDir = {
      ...defaultExecaOptions,
      cwd: resolvedBlockDirPath,
    };

    await execa(
      "npm",
      ["install", "--cache", tmpNodeCacheDir.path],
      execaOptionsInBlockDir,
    );

    logStepEnd();

    if (blockTemplate && ["custom-element", "react"].includes(blockTemplate)) {
      logStepStart("Test codegen");

      await execa("npm", ["run", "codegen"], execaOptionsInBlockDir);

      logStepEnd();
    }

    logStepStart("Dev Server");

    const devProcess = execa("npm", ["run", "dev"], {
      ...execaOptionsInBlockDir,
      env: {
        ...execaOptionsInBlockDir.env,
        BROWSER: "none", // Disable browser tab opening
      },
    });

    await waitOn({ resources: ["http://127.0.0.1:63212"], timeout: 30000 });

    await killProcessTree(devProcess.pid!, "SIGINT");

    logStepEnd();
    logStepStart("Linting");

    const blockPackageJson = await fs.readJson(
      path.resolve(resolvedBlockDirPath, "package.json"),
    );

    for (const scriptName of ["fix:eslint", "lint:eslint", "prepublishOnly"]) {
      if (blockPackageJson.scripts[scriptName]) {
        throw new Error(
          `Unexpected to find \`${scriptName}\` script in block package.json`,
        );
      }
    }

    if (blockPackageJson.scripts["lint:tsc"]) {
      await execa("npm", ["run", "lint:tsc"], execaOptionsInBlockDir);
    } else {
      console.log("Skipping (yarn lint:tsc is not configured)");
    }

    logStepEnd();
    logStepStart("Build");

    await execa("npm", ["run", "build"], execaOptionsInBlockDir);

    logStepEnd();
  } finally {
    await Promise.all([
      tmpBlockParentDir?.cleanup(),
      tmpNodeCacheDir.cleanup(),
    ]);
  }
};

await script();
