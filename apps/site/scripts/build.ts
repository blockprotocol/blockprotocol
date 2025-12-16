import path from "node:path";

import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";

const script = async () => {
  console.log(chalk.bold("Building..."));

  await import("./codegen");

  // Skip schema generation if the file already exists (pre-generated and committed)
  const schemaPath = path.resolve(
    process.cwd(),
    "public/schemas/block-metadata.json",
  );
  if (await fs.pathExists(schemaPath)) {
    console.log(
      chalk.green(
        "Skipping block-metadata schema generation (file already exists).",
      ),
    );
  } else {
    await execa("yarn", ["generate-blockmetadata-schema"], {
      stdio: "inherit",
    });
  }

  const hasMongoEnv =
    Boolean(process.env.MONGODB_URI) && Boolean(process.env.MONGODB_DB_NAME);

  if (hasMongoEnv) {
    await import("./create-db-indexes");
  } else {
    console.log(
      chalk.yellow(
        "Skipping DB index creation (MONGODB_URI/MONGODB_DB_NAME not set).",
      ),
    );
  }

  // @todo Remove babel.config.json when next.config.js supports swcInstrumentCoverage
  // https://github.com/vercel/next.js/pull/36692
  const babelConfigPath = path.resolve(process.cwd(), "babel.config.json");
  if (process.env.TEST_COVERAGE) {
    await fs.writeJson(babelConfigPath, {
      presets: ["next/babel"],
      plugins: ["istanbul"],
    });
    await execa("nyc", ["--cwd=../..", "next", "build"], { stdio: "inherit" });
    await fs.remove(babelConfigPath);
  } else {
    if (await fs.pathExists(babelConfigPath)) {
      await fs.remove(babelConfigPath);
    }
    await execa("next", ["build"], { stdio: "inherit" });
  }
};

await script();
