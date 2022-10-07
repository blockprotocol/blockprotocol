const path = require("node:path");
const fs = require("node:fs");

const monorepoRoot = path.resolve(__dirname, "../../..");

/**
 * @param {string} workspaceDirPath
 * @returns {string[]}
 */
module.exports = (workspaceDirPath) => {
  const [, match] =
    fs
      .readFileSync(`${monorepoRoot}/.gitignore`, "utf8")
      .match(/Shared between git and linters([^\0]*?)Specific to git/) ?? [];

  if (!match) {
    throw new Error(
      "Could not find shared .gitignore patterns. Please update .gitignore or the regexp in this file.",
    );
  }

  const workspaceDirPrefix = `${path
    .relative(monorepoRoot, workspaceDirPath)
    .replace(/\\/g, "/")}/`;

  const sharedPatternsFromGitignore = match
    .split("\n")
    .map((line) => {
      // Ignore empty lines and comments
      if (!line || line.startsWith("#")) {
        return [];
      }
      // Ignore patterns specific to other workspaces
      if (line.includes("/") && !line.startsWith(workspaceDirPrefix)) {
        return [];
      }
      // Remove workspace-specific prefix (path/to/workspace/foo/**/bar => foo/**/bar)
      if (line.startsWith(workspaceDirPrefix)) {
        return [line.replace(workspaceDirPrefix, "")];
      }
      return [line];
    })
    .flat();

  return [
    // Ignore all files (but still allow sub-folder scanning)
    "*",
    "!*/",

    // Allow certain file types
    "!*.cjs",
    "!*.js",
    "!*.jsx",
    "!*.mjs",
    "!*.ts",
    "!*.tsx",

    // Add patterns extracted from .gitignore
    ...sharedPatternsFromGitignore,
  ];
};
