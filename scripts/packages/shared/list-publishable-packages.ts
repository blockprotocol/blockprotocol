import fs from "fs-extra";

export interface PackageInfo {
  name: string;
  path: string;
  version: string;
}

const packageParentFolders = ["packages", "packages/@blockprotocol"];

export const listPublishablePackages = async (): Promise<PackageInfo[]> => {
  const result: PackageInfo[] = [];

  const pathsWithNamespace = (
    await Promise.all(
      packageParentFolders.map((parent) =>
        fs
          .readdir(parent)
          .then((children) => children.map((child) => `${parent}/${child}`)),
      ),
    )
  ).flat();

  for (const pathWithNamespace of pathsWithNamespace) {
    try {
      const packageJson = await fs.readJson(
        `${pathWithNamespace}/package.json`,
      );
      if (packageJson.private !== true) {
        result.push({
          name: packageJson.name,
          path: pathWithNamespace,
          version: packageJson.version,
        });
      }
    } catch {
      // noop (packages/* is a file or does not contain package.json)
    }
  }

  console.log(
    `Publishable package names: ${["", ...result.map(({ name }) => name)].join(
      "\n- ",
    )}`,
  );

  return result;
};
