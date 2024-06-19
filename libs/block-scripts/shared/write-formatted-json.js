import fs from "fs-extra";

/**
 * @param {string} file
 * @param {unknown} object
 */
export const writeFormattedJson = async (file, object) => {
  await fs.writeJson(file, object, { spaces: 2 });
};
