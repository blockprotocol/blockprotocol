import execa from "execa";
import sleep from "sleep-promise";
import path from "path";

// These variables are hardcoded on purpose. We don’t want to accidentally push to a real registry.
const npmRegistry = "http://localhost:4873";
const npmUserAndPassword = "verdaccio";
const npmEmail = "verdaccio@example.com";

const packageNames = ["blockprotocol", "block-template", "create-block-app"];

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
  // Login
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

  for (const packageName of packageNames) {
    const packageDirPath = path.resolve(`packages/${packageName}`);
    await execa("npm", ["unpublish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
      reject: false,
    });

    await execa("npm", ["publish", "--force"], {
      ...defaultExecaOptions,
      cwd: packageDirPath,
    });
  }
};

void script();
