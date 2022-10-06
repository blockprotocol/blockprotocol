import path from "node:path";

import chalk from "chalk";
import execa from "execa";
import fs from "fs-extra";
import { format } from "prettier";
import { listPublishablePackages } from "./shared/list-publishable-packages";
import { monorepoRoot } from "./shared/monorepo-root";

const script = async () => {
  console.log(chalk.bold("Removing ESLint from templates..."));

  if (
    (
      await execa("git", ["diff", "--exit-code"], {
        cwd: monorepoRoot,
        reject: false,
      })
    ).exitCode
  ) {
    console.log(chalk.red("Please commit changes before running this script"));
    process.exit(1);
  }

  const publishablePackages = await listPublishablePackages();

  for (const blockTemplatePackage of publishablePackages.filter(({ name }) =>
    name.match(/^block-template-/),
  )) {
    process.stdout.write(
      `Removing ESLint from ${blockTemplatePackage.name}...`,
    );

    await fs.remove(path.join(blockTemplatePackage.path, ".eslintrc.cjs"));
    const packageJsonFilePath = path.join(
      blockTemplatePackage.path,
      "package.json",
    );
    const packageJson = await fs.readJson(packageJsonFilePath);
    delete packageJson.scripts["lint:eslint"];
    delete packageJson.scripts["fix:eslint"];
    delete packageJson.devDependencies["eslint"];
    delete packageJson.devDependencies["@local/eslint-config"];

    await fs.writeFile(
      packageJsonFilePath,
      format(JSON.stringify(packageJson), { parser: "json" }),
    );

    process.stdout.write(" Done \n");
  }
};

await script();
