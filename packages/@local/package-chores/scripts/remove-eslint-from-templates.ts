import path from "node:path";

import chalk from "chalk";
import execa from "execa";
import fs from "fs-extra";
import { format } from "prettier";
import { listPublishablePackages } from "./shared/publishable-packages";
import { monorepoRoot } from "./shared/monorepo-root";

// We depend on @local/eslint-config in yarn workspaces to be able to run ESLint.
// However, we don't want this dependency to appear on npm for templates, so we remove it.
// This script is meant to be run before publishing.

const script = async () => {
  console.log(chalk.bold("Removing ESLint from templates..."));

  const publishablePackages = await listPublishablePackages();

  if (
    (
      await execa(
        "git",
        ["diff", "--exit-code", ...publishablePackages.map(({ path }) => path)],
        {
          cwd: monorepoRoot,
          reject: false,
        },
      )
    ).exitCode
  ) {
    console.log(
      chalk.red(
        "Please commit or revert changes in templates before running this script",
      ),
    );
    process.exit(1);
  }

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

    const formattedPackageJson = format(JSON.stringify(packageJson), {
      filepath: "package.json",
    });
    await fs.writeFile(packageJsonFilePath, formattedPackageJson);

    const { stdout: rawFilePaths } = await execa("git", ["ls-files"], {
      cwd: blockTemplatePackage.path,
    });

    let filePathsWithEslintMentions: string[] = [];
    for (const filePath of rawFilePaths.split("\n")) {
      const resolvedFilePath = path.resolve(
        blockTemplatePackage.path,
        filePath,
      );
      if (
        (await fs.pathExists(resolvedFilePath)) &&
        (filePath.includes("eslint") ||
          (await fs.readFile(resolvedFilePath, "utf8")).includes("eslint"))
      ) {
        filePathsWithEslintMentions.push(resolvedFilePath);
      }
    }

    if (filePathsWithEslintMentions.length) {
      console.log(
        chalk.red(
          `\nThe following files in this template still mention ESLint:\n  ${filePathsWithEslintMentions
            .map((filePath) => path.relative(monorepoRoot, filePath))
            .join(
              "\n  ",
            )}\n All ESLint traces should be removable before publish. Custom directives should be moved to .eslintrc.cjs`,
        ),
      );
      process.exit(1);
    }

    process.stdout.write(" Done \n");
  }
};

await script();
