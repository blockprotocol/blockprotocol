import { findUp } from "find-up";
import path from "node:path";

/**
 * Find the path to the project root, by searching upwards for the nearest package.json
 * @returns {Promise<string|undefined>}
 */
export const findProjectRoot = async () => {
  const packageJson = await findUp("package.json");
  if (packageJson) {
    return path.dirname(packageJson);
  }
};
