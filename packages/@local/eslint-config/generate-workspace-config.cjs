/**
 * @param {string} dirname
 * @returns {import("eslint").Linter.Config}
 */
module.exports = (dirname) => ({
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("./generate-ignore-patterns.cjs")(dirname),
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${dirname}/tsconfig.json`,
  },
});
