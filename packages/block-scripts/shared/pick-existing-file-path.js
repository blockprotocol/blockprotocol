import fs from "fs-extra";

import { UserFriendlyError } from "./errors.js";

/**
 * @param {string[]} filePaths
 * @param {string} description
 * @returns {Promise<string>}
 */
export const pickExistingFilePath = async (filePaths, description) => {
  for (const filePath of filePaths) {
    if (await fs.pathExists(filePath)) {
      return filePath;
    }
  }

  throw new UserFriendlyError(
    `Unable to find ${description}. Please create one of these files: ${filePaths.join(
      ", ",
    )}`,
  );
};
