import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import * as envalid from "envalid";

const monorepoRoot = path.resolve(__dirname, "../..");

const script = async () => {
  console.log(chalk.bold("Copying blocks from CI cache..."));

  const env = envalid.cleanEnv(process.env, {
    BLOCKS_DIR: envalid.str({
      desc: "location of built blocks that are ready to be served",
      default: path.resolve(monorepoRoot, "site/public/blocks"),
    }),
    BLOCKS_CI_CACHE_DIR: envalid.str({
      desc: "Location of blocks in CI cache",
      default: path.resolve(monorepoRoot, "site/.next/cache/blocks"),
    }),
  });

  const resolvedBlocksDir = path.resolve(monorepoRoot, env.BLOCKS_DIR);
  const resolvedBlocksCiCacheDir = path.resolve(
    monorepoRoot,
    env.BLOCKS_CI_CACHE_DIR,
  );

  if (!(await fs.pathExists(resolvedBlocksCiCacheDir))) {
    console.log(
      chalk.gray(
        `Skipping (CI cache not found at ${resolvedBlocksCiCacheDir})`,
      ),
    );
    return;
  }

  await fs.ensureDir(path.dirname(resolvedBlocksDir));

  await fs.copy(resolvedBlocksCiCacheDir, resolvedBlocksDir, {
    recursive: true,
  });

  console.log(`Done.`);
};

export default script();
