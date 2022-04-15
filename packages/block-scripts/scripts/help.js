import chalk from "chalk";
import { getBlockScriptsVersion } from "../shared/config.js";

const script = async () => {
  console.log(
    `${chalk.bold(
      "Block Scripts",
    )} (version ${await getBlockScriptsVersion()})`,
  );
  console.log("");
  console.log(
    `See ${chalk.underline(
      "https://blockprotocol.org/docs/developing-blocks",
    )}`,
  );
  console.log("");
};

await script();
