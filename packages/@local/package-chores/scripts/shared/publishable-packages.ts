import path from "node:path";

import fs from "fs-extra";

import { monorepoRoot } from "./monorepo-root";

export interface PackageInfo {
  name: string;
  path: string;
  version: string;
}

const packageParentFolders = [
  path.resolve(monorepoRoot, "packages"),
  path.resolve(monorepoRoot, "packages/@blockprotocol"),
];

export const listPublishablePackages = async (): Promise<PackageInfo[]> => {
  const result: PackageInfo[] = [];

  const packagePaths = (
    await Promise.all(
      packageParentFolders.map((parent) =>
        fs
          .readdir(parent)
          .then((children) => children.map((child) => `${parent}/${child}`)),
      ),
    )
  ).flat();

  for (const packagePath of packagePaths) {
    try {
      const packageJson = await fs.readJson(`${packagePath}/package.json`);
      if (packageJson.private !== true) {
        result.push({
          name: packageJson.name,
          path: packagePath,
          version: packageJson.version,
        });
      }
    } catch {
      // noop (packages/* is a file or does not contain package.json)
    }
  }

  return result;
};

export const printPublishablePackages = (packageInfos: PackageInfo[]): void => {
  console.log(
    `Publishable package names: ${[
      "",
      ...packageInfos.map(({ name }) => name),
    ].join("\n- ")}\n`,
  );
};
