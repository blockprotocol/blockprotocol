import * as fs from "node:fs/promises";
import * as path from "node:path";

import { InitializeContext } from "../context/initialize.js";

export const cleanOutputDir = async (
  context: InitializeContext,
): Promise<void> => {
  context.logDebug("Cleaning target dir");

  const resolvedTargetDir = path.resolve(context.parameters.outputFolder);
  const promises = [];
  for (const dirContents of await fs.readdir(resolvedTargetDir)) {
    context.logTrace(`Removing ${dirContents} from ${resolvedTargetDir}..`);
    promises.push(fs.rm(dirContents, { recursive: true }));
  }
  await Promise.all(promises);
};
