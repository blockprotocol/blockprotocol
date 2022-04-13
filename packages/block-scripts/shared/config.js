import fs from "fs-extra";

import { blockPackageJsonPath } from "./paths.js";

export const extractScriptConfig = () => {
  try {
    return JSON.parse(process.env.SCRIPT_CONFIG);
  } catch {
    return {};
  }
};

export const extractBlockScriptsConfigFromPackageJson = async () => {
  try {
    return (await fs.readJson(blockPackageJsonPath))["block-scripts"] ?? {};
  } catch {
    return {};
  }
};
