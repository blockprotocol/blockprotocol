import path from "node:path";

import { logStepEnd, logStepStart } from "@local/script-resources/logging";
import chalk from "chalk";
import { execa } from "execa";
import sleep from "sleep-promise";

import {
  listPublishablePackages,
  printPublishablePackages,
} from "./shared/publishable-packages";

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
  console.log(chalk.bold("Publishing packages to local registry..."));

  const publishablePackages = await listPublishablePackages();
  printPublishablePackages(publishablePackages);

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

  for (const blockTemplatePackage of publishablePackages.filter(({ name }) =>
    name.match(/^block-template-/),
  )) {
    logStepStart(
      `Run yarn build in ${blockTemplatePackage.name} (to check if temp files are published)`,
    );

    await execa("yarn", ["build"], {
      ...defaultExecaOptions,
      cwd: path.resolve(blockTemplatePackage.path),
    });

    logStepEnd();
  }

  for (const publishablePackage of publishablePackages) {
    logStepStart(
      `Unpublish ${publishablePackage.name} from local registry (if present)`,
    );

    await execa("npm", ["unpublish", "--force"], {
      ...defaultExecaOptions,
      cwd: publishablePackage.path,
      reject: false,
    });

    logStepEnd();
    logStepStart(`Publish ${publishablePackage.name} to local registry`);

    await execa("npm", ["publish", "--force"], {
      ...defaultExecaOptions,
      cwd: publishablePackage.path,
    });

    logStepEnd();
  }
};

await script();
