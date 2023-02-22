import path from "node:path";
import { fileURLToPath } from "node:url";

import chalk from "chalk";
import * as envalid from "envalid";
import fs from "fs-extra";

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const script = async () => {
  console.log(chalk.bold("Copying blocks to CI cache..."));

  const env = envalid.cleanEnv(process.env, {
    BLOCKS_DIR: envalid.str({
      desc: "location of built blocks that are ready to be served",
      default: path.resolve(monorepoRoot, "apps/site/public/blocks"),
    }),
    BLOCKS_CI_CACHE_DIR: envalid.str({
      desc: "Location of blocks in CI cache",
      default: path.resolve(monorepoRoot, "apps/site/.next/cache/blocks"),
    }),
  });

  const resolvedBlocksDir = path.resolve(monorepoRoot, env.BLOCKS_DIR);
  const resolvedBlocksCiCacheDir = path.resolve(
    monorepoRoot,
    env.BLOCKS_CI_CACHE_DIR,
  );

  await fs.ensureDir(path.dirname(resolvedBlocksCiCacheDir));

  await fs.copy(resolvedBlocksDir, resolvedBlocksCiCacheDir, {
    recursive: true,
  });

  console.log("Done.");
};

await script();
