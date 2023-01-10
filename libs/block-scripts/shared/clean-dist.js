import fs from "fs-extra";

import { blockDistDirPath } from "./paths.js";

export const cleanDist = () =>
  fs.rm(blockDistDirPath, { recursive: true, force: true });
