module.exports = {
  root: true,
  extends: ["."],
  ignorePatterns: require("./generate-ignore-patterns.cjs")(__dirname),
  rules: {
    "global-require": "off",
  },
};
