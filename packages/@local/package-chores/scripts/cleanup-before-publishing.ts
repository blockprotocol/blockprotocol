import path from "node:path";

import chalk from "chalk";
import execa from "execa";
import fs from "fs-extra";
import { format } from "prettier";
import { listPublishablePackages } from "./shared/publishable-packages";
import { monorepoRoot } from "./shared/monorepo-root";
import * as envalid from "envalid";
import { UserFriendlyError } from "./shared/errors";

const updateJson = async (
  jsonFilePath: any,
  transform: (existingJson: any) => void,
) => {
  const json = await fs.readJson(jsonFilePath);
  transform(json);
  const formattedPackageJson = format(JSON.stringify(json), {
    filepath: jsonFilePath,
  });
  await fs.writeFile(jsonFilePath, formattedPackageJson);
};

const ensureTermIsNotMentioned = async ({
  packageDirPath,
  termToAvoid,
  advice,
}: {
  packageDirPath: string;
  termToAvoid: string;
  advice: string;
}) => {
  const normalizedTermToAvoid = termToAvoid.toLowerCase();
  const { stdout: rawFilePaths } = await execa("git", ["ls-files"], {
    cwd: packageDirPath,
  });

  let filePathsWithMentions: string[] = [];
  for (const filePath of rawFilePaths.split("\n")) {
    const resolvedFilePath = path.resolve(packageDirPath, filePath);
    if (
      (await fs.pathExists(resolvedFilePath)) &&
      (filePath.toLowerCase().includes(normalizedTermToAvoid) ||
        (await fs.readFile(resolvedFilePath, "utf8"))
          .toLowerCase()
          .includes(normalizedTermToAvoid))
    ) {
      filePathsWithMentions.push(resolvedFilePath);
    }
  }

  if (filePathsWithMentions.length) {
    throw new UserFriendlyError(
      `The following files in this template still mention ${termToAvoid}:\n  ${filePathsWithMentions
        .map((filePath) => path.relative(monorepoRoot, filePath))
        .join(
          "\n  ",
        )}\n All traces mentioning ${normalizedTermToAvoid} should be removable before publish. ${advice}`,
    );
  }
};

const script = async () => {
  console.log(chalk.bold("Cleaning up before publishing..."));
  const env = envalid.cleanEnv(process.env, {
    PACKAGE_DIR: envalid.str({
      desc: "location of package to cleanup",
    }),
  });
  const packageDirPath = path.resolve(env.PACKAGE_DIR);

  if (packageDirPath !== env.PACKAGE_DIR) {
    throw new UserFriendlyError(
      `PACKAGE_DIR must be an absolute path, got ${packageDirPath}`,
    );
  }

  const publishablePackageInfos = await listPublishablePackages();
  const packageInfo = publishablePackageInfos.find(
    (packageInfo) => packageInfo.path === packageDirPath,
  );

  if (!packageInfo) {
    throw new UserFriendlyError(
      `PACKAGE_DIR (${packageDirPath}) does not point to a publishable package`,
    );
  }
  console.log("");
  console.log(`Package name: ${packageInfo.name}`);
  console.log(`Package path: ${packageInfo.path}`);
  console.log("");

  if (
    (
      await execa("git", ["diff", "--exit-code", packageDirPath], {
        cwd: monorepoRoot,
        reject: false,
      })
    ).exitCode
  ) {
    throw new UserFriendlyError(
      `Please commit or revert changes in ${packageDirPath} before running this script`,
    );
  }

  // We depend on @local/eslint-config in yarn workspaces to be able to run ESLint.
  // However, we don't want this dependency to appear on npm for templates, so we remove it.
  // This script is meant to be run before publishing.

  process.stdout.write(`Removing ESLint...`);
  await fs.remove(path.join(packageDirPath, ".eslintrc.cjs"));

  await updateJson(path.join(packageDirPath, "package.json"), (packageJson) => {
    delete packageJson.scripts["lint:eslint"];
    delete packageJson.scripts["fix:eslint"];
    delete packageJson.devDependencies["eslint"];
    delete packageJson.devDependencies["@local/eslint-config"];
  });

  await ensureTermIsNotMentioned({
    packageDirPath,
    termToAvoid: "ESLint",
    advice: "Custom directives should be moved to .eslintrc.cjs",
  });

  process.stdout.write(" Done \n");

  process.stdout.write(`Removing prepublishOnly...`);

  await updateJson(path.join(packageDirPath, "package.json"), (packageJson) => {
    delete packageJson.scripts["prepublishOnly"];
  });
  process.stdout.write(" Done \n");
};

await script();
