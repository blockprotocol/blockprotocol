const path = require("node:path");

module.exports = (workspaceDirPath) => {
  const monorepoRoot = path.resolve(__dirname, "../../..");
  const workspaceDirPrefix = `${path
    .relative(monorepoRoot, workspaceDirPath)
    .replace(/\\/g, "/")}/`;

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

    // Add patterns from .gitignore
    // eslint-disable-next-line global-require
    ...require("node:fs")
      .readFileSync(`${monorepoRoot}/.gitignore`, "utf8")
      .match(/Shared between git and linters([^\0]*?)Specific to git/)[1]
      .split("\n")
      .map((line) => {
        if (!line || line.startsWith("#")) {
          return [];
        }
        if (line.includes("/") && !line.startsWith(workspaceDirPrefix)) {
          return [];
        }
        if (line.startsWith(workspaceDirPrefix)) {
          return [line.replace(workspaceDirPrefix, "")];
        }
        return [line];
      })
      .flat(),
  ];
};
