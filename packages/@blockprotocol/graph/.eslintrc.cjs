/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
  rules: {
    // import plugin does not support .js file extensions in .ts files, which ESM TS projects require
    // https://github.com/import-js/eslint-plugin-import/issues/2446
    "import/no-unresolved": "off",
  },
};
