import path from "node:path";
import { fileURLToPath } from "node:url";

export const blockRootDirPath = path.resolve(".");
export const blockDistDirPath = path.resolve(blockRootDirPath, "dist");

export const blockScriptsPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "scripts",
);
