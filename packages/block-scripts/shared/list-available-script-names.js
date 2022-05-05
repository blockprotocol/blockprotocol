import fs from "fs-extra";
import path from "node:path";

import { packageScriptsDirPath } from "./paths.js";

export const listAvailableScriptNames = async () => {
  const scriptFileNames = await fs.readdir(path.resolve(packageScriptsDirPath));

  return scriptFileNames.map((scriptFileName) =>
    path.basename(scriptFileName, ".js"),
  );
};
