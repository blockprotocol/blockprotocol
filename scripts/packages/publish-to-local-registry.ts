import chalk from "chalk";
import execa from "execa";
import fs from "fs-extra";
import path from "node:path";
import sleep from "sleep-promise";

import { logStepEnd, logStepStart } from "../shared/logging";

// These variables are hardcoded on purpose. We don’t want to publish to a real registry by mistake.
const npmRegistry = "http://localhost:4873";
const npmUserAndPassword = "verdaccio";
const npmEmail = "verdaccio@example.com";

const defaultExecaOptions = {
  env: {
    NODE_ENV: "development",
    NPM_CONFIG_REGISTRY: npmRegistry,
    PATH: process.env.PATH,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

const script = async () => {
  console.log(chalk.bold("Publishing to local registry..."));

  const publishablePackages: { name: string; path: string }[] = [];

  const packageParentFolders = [
    "packages",
    "packages/block-template/templates",
    "packages/@blockprotocol",
  ];

  const packagePaths = (
    await Promise.all(
      packageParentFolders.map((parent) =>
        fs
          .readdir(parent)
          .then((children) => children.map((child) => `${parent}/${child}`)),
      ),
    )
  ).flat();

  console.log({ packagePaths });

  for (const packagePath of packagePaths) {
    try {
      const packageJson = await fs.readJson(`${packagePath}/package.json`);
      const packageName = packageJson.name;
      if (packageJson.private !== true) {
        publishablePackages.push({ name: packageName, path: packagePath });
      }
    } catch {
      // noop (packages/* is a file or does not contain package.json)
    }
  }

  console.log(
    `Publishable package names: ${[
      "",
      ...publishablePackages.map(({ name }) => name),
    ].join("\n- ")}`,
  );

  logStepStart("Login into local registry");

  if (!npmRegistry.includes("localhost")) {
    throw new Error(
      "This script runs `npm unpublish` which can harm published packages. Please make sure `npmRegistry` value includes `localhost`.",
    );
  }

  const addUserProcess = execa("npm", ["adduser"], {
    ...defaultExecaOptions,
    stdio: undefined,
    stdout: "inherit",
  });

  // Execa does not support multiple prompts, so using sleep to enter credentials
  // https://github.com/sindresorhus/execa/issues/418
  await sleep(500);
  addUserProcess.stdin?.write(`${npmUserAndPassword}\n`);
  await sleep(500);
  addUserProcess.stdin?.write(`${npmUserAndPassword}\n`);
  await sleep(500);
  addUserProcess.stdin?.write(`${npmEmail}\n`);
  await addUserProcess;

  logStepEnd();
  logStepStart(
    `Run yarn build in block-template (to check if dist files are published)`,
  );

  await execa("yarn", ["build"], {
    ...defaultExecaOptions,
    cwd: path.resolve(`packages/block-template/templates/react`),
  });

  logStepEnd();

  for (const publishablePackage of publishablePackages) {
    const packageDirPath = path.resolve(`packages/${publishablePackage.path}`);

    logStepStart(
      `Unpublish ${publishablePackage.name} from local registry (if present)`,
    );

    await execa("npm", ["unpublish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
      reject: false,
    });

    logStepEnd();
    logStepStart(`Publish ${publishablePackage.name} to local registry`);

    await execa("npm", ["publish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
    });

    logStepEnd();
  }
};

await script();
