import fs from "fs-extra";

export const writeFormattedJson = async (file, object) => {
  await fs.writeJson(file, object, { spaces: 2 });
};
