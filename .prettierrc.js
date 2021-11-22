/**
 * @file downstream of hashintel/dev/.prettierrc.js
 * @see https://prettier.io/docs/en/configuration.html
 */
module.exports = {
  trailingComma: "all",
  printWidth: 100,
  plugins: [
    require("prettier-plugin-packagejson"),
    require("prettier-plugin-sh"),
  ],
};
