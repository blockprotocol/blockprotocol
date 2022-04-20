import fs from "fs-extra";

import { blockPackageJsonPath, packageJsonDirPath } from "./paths.js";

export const extractScriptConfig = () => {
  try {
    return JSON.parse(process.env.SCRIPT_CONFIG);
  } catch {
    return {};
  }
};

const getBlockPackageJson = async () => {
  return await fs.readJson(blockPackageJsonPath);
};

export const extractBlockScriptsConfigFromPackageJson = async () => {
  try {
    return (await getBlockPackageJson())["block-scripts"] ?? {};
  } catch {
    return {};
  }
};

const getBlockScriptsPackageJson = async () => {
  return await fs.readJson(packageJsonDirPath);
};

export const getBlockScriptsVersion = async () => {
  return (await getBlockScriptsPackageJson()).version;
};
