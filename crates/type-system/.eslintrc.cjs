/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("@local/eslint-config/base-ignore-patterns.cjs"),
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${__dirname}/tsconfig.json`,
  },
};
