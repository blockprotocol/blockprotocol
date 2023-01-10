import fs from "fs-extra";

import { blockPackageJsonPath, packageJsonDirPath } from "./paths.js";

export const extractScriptConfig = () => {
  try {
    return JSON.parse(process.env.SCRIPT_CONFIG || "{}");
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

/**
 * @param {"development" | "production"} mode
 * @returns {Promise<number>}
 */
export const getPort = async (mode) => {
  const blockScriptsConfig = await extractBlockScriptsConfigFromPackageJson();
  return (
    Number.parseInt(extractScriptConfig().listen, 10) ||
    Number.parseInt(
      mode === "development"
        ? blockScriptsConfig.devPort
        : blockScriptsConfig.servePort,
      10,
    ) ||
    Number.parseInt(blockScriptsConfig.port, 10) ||
    63212
  );
};

const getBlockScriptsPackageJson = async () => {
  return await fs.readJson(packageJsonDirPath);
};

export const getBlockScriptsVersion = async () => {
  return (await getBlockScriptsPackageJson()).version;
};
