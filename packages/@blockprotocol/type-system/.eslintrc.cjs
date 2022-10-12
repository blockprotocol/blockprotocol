/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  rules: {
    "import/export": "off",
    "import/extensions": "off",
    "import/named": "off",
    "import/no-cycle": "off",
    "import/resolve": "off",
  },
  overrides: [
    {
      files: "**.test.ts",
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
