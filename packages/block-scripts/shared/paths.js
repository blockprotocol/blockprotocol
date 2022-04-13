import path from "node:path";
import { fileURLToPath } from "node:url";

export const blockRootDirPath = path.resolve(".");
export const blockDistDirPath = path.resolve(blockRootDirPath, "dist");
export const blockPackageJsonPath = path.resolve(
  blockRootDirPath,
  "package.json",
);

export const scriptsPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "scripts",
);
