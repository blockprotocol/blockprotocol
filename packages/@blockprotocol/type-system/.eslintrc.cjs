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
        "import/no-unresolved": "off", // "ava" not found, possible to do with ESM exports
      },
    },
  ],
};
