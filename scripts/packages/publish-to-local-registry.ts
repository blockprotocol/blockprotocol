import execa from "execa";
import sleep from "sleep-promise";
import path from "path";
import chalk from "chalk";
import { logStepEnd, logStepStart } from "../shared/logging";

// These variables are hardcoded on purpose. We don’t want to publish to a real registry by mistake.
const npmRegistry = "http://localhost:4873";
const npmUserAndPassword = "verdaccio";
const npmEmail = "verdaccio@example.com";

const packageNames = [
  "block-scripts",
  "block-template",
  "blockprotocol",
  "create-block-app",
  "mock-block-dock",
];

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
    cwd: path.resolve(`packages/block-template`),
  });

  logStepEnd();

  for (const packageName of packageNames) {
    const packageDirPath = path.resolve(`packages/${packageName}`);

    logStepStart(`Unpublish ${packageName} from local registry (if present)`);

    await execa("npm", ["unpublish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
      reject: false,
    });

    logStepEnd();
    logStepStart(`Publish ${packageName} to local registry`);

    await execa("npm", ["publish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
    });

    logStepEnd();
  }
};

void script();
