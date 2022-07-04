import axios from "axios";
import chalk from "chalk";
import * as envalid from "envalid";
import execa from "execa";

import { logStepEnd, logStepStart } from "../shared/logging";
import { listPublishablePackages } from "./shared/list-publishable-packages";

const defaultExecaOptions = {
  env: {
    NODE_ENV: "development",
    PATH: process.env.PATH,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

const script = async () => {
  const env = envalid.cleanEnv(process.env, {
    DRY_RUN: envalid.bool({
      default: true,
      desc: "If set to true, using `npm publish --dry-run`",
    }),
  });
  const dryRun = env.DRY_RUN;

  console.log(
    chalk.bold(
      `Publishing packages to npmjs.com${dryRun ? " (DRY_RUN mode)" : ""}...`,
    ),
  );

  const publishablePackages = await listPublishablePackages();

  for (const publishablePackage of publishablePackages) {
    const url = `https://registry.npmjs.com/${publishablePackage.name}/${publishablePackage.version}`;
    const response = await axios.head(url, {
      validateStatus: (status) => status === 404 || status === 200,
    });

    if (response.status === 200) {
      console.log(
        `Skipping ${publishablePackage.name} because version ${publishablePackage.version} is already published`,
      );
      continue;
    }

    logStepStart(`Publish ${publishablePackage.name}`);

    const execaArgs: string[] = ["publish"];
    if (dryRun) {
      execaArgs.push("--dry-run");
    }

    const distTag = publishablePackage.version.match(/(?:^\d+\.\d+\.\d+)-(.+)\./)?.[1];
    if (distTag) {
      console.log(`Publishing with tag '${distTag}'`);
      execaArgs.push("--tag", distTag);
    }

    await execa("npm", execaArgs, {
      ...defaultExecaOptions,
      cwd: publishablePackage.path,
    });

    logStepEnd();
  }
};

await script();
