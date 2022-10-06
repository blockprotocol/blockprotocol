/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: require("@local/eslint-config/generate-ignore-patterns.cjs")(
    __dirname,
  ),
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${__dirname}/tsconfig.json`,
  },
  overrides: [
    {
      files: ["src/dev.tsx"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
  ],
};
