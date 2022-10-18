import chalk from "chalk";
import execa from "execa";
import { monorepoRoot } from "./shared/monorepo-root";

// Context:
// https://github.com/changesets/action/issues/225

const script = async () => {
  await import("./remove-eslint-from-templates");

  console.log(chalk.bold(`Publishing packages to npmjs.com...`));

  await execa("yarn", ["changeset", "publish"], {
    cwd: monorepoRoot,
    extendEnv: true,
    stdio: "inherit",
  });

  console.log("Done.");
};

await script();
