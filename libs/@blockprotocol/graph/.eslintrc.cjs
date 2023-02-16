/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  plugins: ["custom"],
  overrides: [
    {
      "files": ["src/index.ts"],
      rules: {
        "custom/enforce-reexport": "error",
      }
    },
  ]
};
