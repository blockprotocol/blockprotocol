import execa from "execa";
import path from "path";
import tmp from "tmp-promise";
import waitOn from "wait-on";
import treeKill from "tree-kill";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import { logStepStart, logStepEnd } from "../shared/logging";

/**
 * Calling `execa.kill()` does not terminate processes recursively on Ubuntu.
 * Using `killProcessTree` helps avoid hanging processes.
 *
 * Anonymous function is use inside promisify because promisify(treeKill)
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
    HOME: process.env.HOME,
    NODE_ENV: "development",
    NPM_CONFIG_REGISTRY: process.env.NPM_CONFIG_REGISTRY,
    PATH: process.env.PATH,
    USERPROFILE: process.env.USERPROFILE,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

const script = async () => {
  const blockName = process.env.BLOCK_NAME ?? "test-block";
  const userDefinedBlockDirPath = process.env.BLOCK_DIR_PATH;

  const tmpDir = userDefinedBlockDirPath
    ? undefined
    : await tmp.dir({ unsafeCleanup: true });

  const resolvedBlockDirPath = tmpDir
    ? path.resolve(tmpDir?.path, blockName)
    : path.resolve(userDefinedBlockDirPath!);

  const fileNames =
    (await fs.readdir(resolvedBlockDirPath).catch(() => {})) ?? [];

  if (fileNames.length) {
    throw new Error(
      `Unable to use ${resolvedBlockDirPath} as block directory because it is not empty`,
    );
  }

  try {
    logStepStart("Create Block App");

    await execa("npx", ["create-block-app", blockName, resolvedBlockDirPath], {
      ...defaultExecaOptions,
      cwd: os.tmpdir(),
    });

    logStepEnd();
    logStepStart("Install dependencies");

    const execaOptionsInBlockDir = {
      ...defaultExecaOptions,
      cwd: resolvedBlockDirPath,
    };

    await execa("npm", ["install"], execaOptionsInBlockDir);

    logStepEnd();
    logStepStart("Dev Server");

    const devProcess = execa("npm", ["run", "dev"], {
      ...execaOptionsInBlockDir,
      env: {
        ...execaOptionsInBlockDir.env,
        BROWSER: "none", // Blocks browser tab creation during local runs
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
    void tmpDir?.cleanup();
  }
};

void script();
