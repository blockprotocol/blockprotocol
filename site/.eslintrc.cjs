const noRestrictedImportsConfig = require("@local/eslint-config").rules[
  "no-restricted-imports"
][1];

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@local/eslint-config"],
  ignorePatterns: [
    ...require("@local/eslint-config/base-ignore-patterns.cjs"),
    "blocks-data.json",
    "playwright-report",
    "public/blocks",
    "public/schemas",
    "site-map.json",
    "test-results",
  ],
  parserOptions: {
    tsconfigRootDir: ".",
    project: `${__dirname}/tsconfig.json`,
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        ...noRestrictedImportsConfig,
        paths: [
          ...noRestrictedImportsConfig.paths,
          {
            // @todo Remove playwright-test-coverage when https://github.com/microsoft/playwright/issues/7030 is resolved
            name: "@playwright/test",
            importNames: ["test"],
            message:
              'Please import "expect" and "test" from "playwright-test-coverage".',
          },
          {
            name: "react",
            importNames: ["FC", "VFC", "VoidFunctionComponent"],
            message: "Please use FunctionComponent instead.",
          },
          {
            name: "@mui/material",
            importNames: ["Link"],
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "@mui/material/Link",
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "next",
            importNames: ["Link"],
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "next/link",
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "@mui/material",
            importNames: ["Button", "TextField", "Alert"],
            message:
              "Please use the custom wrapper component in src/component instead.",
          },
          {
            name: "@mui/material/Button",
            importNames: ["default"],
            message:
              "Please use the custom src/components/Button component instead.",
          },
          {
            name: "@mui/material/TextField",
            importNames: ["default"],
            message:
              "Please use the custom src/components/TextField component instead.",
          },
          {
            name: "@mui/material/Popover",
            importNames: ["default"],
            message:
              "Please use the custom src/components/Popover component instead.",
          },
          {
            name: "@mui/material/Alert",
            importNames: ["default"],
            message:
              "Please use the custom src/components/Alert component instead.",
          },
          {
            name: "notistack",
            importNames: ["useSnackbar"],
            message:
              "Please use the custom src/components/hooks/useSnackbar hook instead.",
          },
        ],
      },
    ],
  },
  overrides: [
    {
      // needed because of package.json in tests (for CJS)
      files: ["**/playwright.config.ts"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
    {
      // needed because of package.json in tests (for CJS)
      files: ["tests/**"],
      rules: {
        "import/no-extraneous-dependencies": ["off"],
      },
    },
  ],
};
