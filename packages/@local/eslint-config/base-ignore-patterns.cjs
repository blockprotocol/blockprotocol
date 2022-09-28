module.exports = [
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
    .readFileSync(`${__dirname}/../../../.gitignore`, "utf8")
    .match(/Shared between git and linters([^\0]*?)Specific to git/)[1]
    .split("\n")
    .map((line) => (line && !line.startsWith("#") ? [line] : []))
    .flat(),
];
