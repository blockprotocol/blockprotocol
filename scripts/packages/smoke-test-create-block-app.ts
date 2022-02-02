import execa from "execa";
import path from "path";
import tmp from "tmp-promise";
import waitOn from "wait-on";

const blockName = "test-block";

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
  await tmp.withDir(
    async ({ path: tempDirPath }) => {
      await execa("npx", ["create-block-app", blockName], {
        ...defaultExecaOptions,
        cwd: tempDirPath,
      });

      const execaOptionsInBlockDir = {
        ...defaultExecaOptions,
        cwd: path.resolve(tempDirPath, blockName),
      };

      await execa("npm", ["install"], execaOptionsInBlockDir);

      const devProcess = execa("npm", ["run", "dev"], {
        ...execaOptionsInBlockDir,
        env: {
          ...execaOptionsInBlockDir.env,
          BROWSER: "none", // Blocks browser tab creation during local runs
        },
      });

      await waitOn({ resources: ["http://localhost:9090"], timeout: 10000 });

      devProcess.kill("SIGINT");

      await execa("npm", ["run", "lint:tsc"], execaOptionsInBlockDir);

      await execa("npm", ["run", "build"], execaOptionsInBlockDir);
    },
    { unsafeCleanup: true },
  );
};

void script();
