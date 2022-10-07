/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  rules: {
    "no-console": "off",
    "import/extensions": ["error", "always"],
  },
};
