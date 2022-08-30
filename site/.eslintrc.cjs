module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  parserOptions: {
    tsconfigRootDir: ".",
    project: "tsconfig.json",
  },
};
