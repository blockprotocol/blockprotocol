import chalk from "chalk";

import { getBlockScriptsVersion } from "../shared/config.js";
import { listAvailableScriptNames } from "../shared/list-available-script-names.js";

const script = async () => {
  const availableScriptNames = await listAvailableScriptNames();

  console.log(
    `${chalk.bold(
      "Block Scripts",
    )} (version ${await getBlockScriptsVersion()})`,
  );
  console.log("");
  console.log(
    `Available scripts: ${availableScriptNames
      .map((availableScriptName) => chalk.blue(availableScriptName))
      .join(", ")}`,
  );
  console.log("");
  console.log(
    `See docs at ${chalk.underline(
      "https://blockprotocol.org/docs/blocks/develop",
    )}`,
  );
  console.log("");
};

await script();
