/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  overrides: [
    {
      files: ["src/app.js"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};
