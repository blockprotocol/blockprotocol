/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  plugins: ["custom"],
  rules: {
    "custom/enforce-reexport": "error",
  },
};
