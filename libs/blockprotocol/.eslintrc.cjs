/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  rules: {
    "no-console": "off",
    "import/extensions": ["error", "ignorePackages"],
    "import/no-cycle": "off", // Need to investigate this (Maximum call stack size exceeded Occurred while linting ... Rule: "import/no-cycle")
  },
};
