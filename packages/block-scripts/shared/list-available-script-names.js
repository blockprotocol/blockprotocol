import path from "node:path";

import fs from "fs-extra";

import { packageScriptsDirPath } from "./paths.js";

export const listAvailableScriptNames = async () => {
  const scriptFileNames = await fs.readdir(path.resolve(packageScriptsDirPath));

  return scriptFileNames.map((scriptFileName) =>
    path.basename(scriptFileName, ".js"),
  );
};
