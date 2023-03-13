import { InitializeContext } from "./context/initialize.js";
import { ensureTargetDirExists } from "./initialize/ensure-target-dir-exists.js";
import { traverseAndCollateSchemas } from "./initialize/traverse-and-collate-schemas.js";

export const initialize = async (context: InitializeContext) => {
  await ensureTargetDirExists(context);
  await traverseAndCollateSchemas(context);
};
