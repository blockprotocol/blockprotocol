import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import * as envalid from "envalid";
import execa from "execa";

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

  await fs.ensureDir(resolvedBlocksDir);
  await fs.ensureDir(resolvedBlocksCiCacheDir);

  await execa(
    "rsync",
    ["--recursive", "--delete", resolvedBlocksDir, resolvedBlocksCiCacheDir],
    { stdio: "inherit" },
  );
};

export default script();
