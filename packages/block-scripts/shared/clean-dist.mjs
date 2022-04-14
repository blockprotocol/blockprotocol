import fs from "fs-extra";

import { blockDistDirPath } from "./paths.mjs";

export const cleanDist = () =>
  fs.rm(blockDistDirPath, { recursive: true, force: true });
