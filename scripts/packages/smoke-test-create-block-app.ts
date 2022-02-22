import execa from "execa";
import path from "path";
import tmp from "tmp-promise";
import fs from "fs-extra";
import waitOn from "wait-on";
import treeKill from "tree-kill";
import { promisify } from "util";
import os from "os";
import untildify from "untildify";
import chalk from "chalk";
import { logStepStart, logStepEnd } from "../shared/logging";

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

    await execa(
      "npx",
      [
        "create-block-app",
        blockName,
        blockDirPath,
        "--cache",
        tmpNodeCacheDir.path,
      ],
      {
        ...defaultExecaOptions,
        cwd: os.tmpdir(),
      },
    );

    logStepEnd();
    logStepStart("Check folder structure");

    for (const relativePath of [".npmignore", "dist"]) {
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
    logStepStart("Dev Server");

    const devProcess = execa("npm", ["run", "dev"], {
      ...execaOptionsInBlockDir,
      env: {
        ...execaOptionsInBlockDir.env,
        BROWSER: "none", // Disable browser tab opening
      },
    });

    await waitOn({ resources: ["http://localhost:9090"], timeout: 10000 });

    await killProcessTree(devProcess.pid!, "SIGINT");

    logStepEnd();
    logStepStart("Linting");

    await execa("npm", ["run", "lint:tsc"], execaOptionsInBlockDir);

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

void script();
