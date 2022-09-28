/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("@local/eslint-config/base-ignore-patterns.cjs"),
  rules: {
    "no-console": "off",
    "import/extensions": ["error", "always"],
  },
};
