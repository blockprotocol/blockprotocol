/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("@local/eslint-config/base-ignore-patterns.cjs"),
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    // import plugin does not support .js file extensions in .ts files, which ESM TS projects require
    // https://github.com/import-js/eslint-plugin-import/issues/2446
    "import/no-unresolved": "off",
  },
};
