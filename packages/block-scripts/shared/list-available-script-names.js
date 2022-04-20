import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import path from "node:path";

export const listAvailableScriptNames = async () => {
  const scriptFileNames = await fs.readdir(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../scripts"),
  );

  return scriptFileNames.map((scriptFileName) =>
    path.basename(scriptFileName, ".js"),
  );
};
