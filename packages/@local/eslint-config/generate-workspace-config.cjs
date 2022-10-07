/**
 * @param {string} workspaceDirPath
 * @returns {import("eslint").Linter.Config}
 */
module.exports = (workspaceDirPath) => ({
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("./generate-ignore-patterns.cjs")(workspaceDirPath),
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${workspaceDirPath}/tsconfig.json`,
  },
});
