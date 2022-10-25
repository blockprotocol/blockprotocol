const noRestrictedImportsConfig = require("@local/eslint-config").rules[
  "no-restricted-imports"
][1];

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...require("@local/eslint-config/generate-workspace-config.cjs")(__dirname),
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
            name: "next",
            importNames: ["Link"],
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "next/link.js",
            message:
              "Please use the custom src/components/Link component instead to ensure Next.js and MUI compatibility.",
          },
          {
            name: "@mui/material",
            importNames: ["Alert", "Button", "Popover", "TextField"],
            message:
              "Please use the custom wrapper component in src/component instead.",
          },
          {
            name: "notistack",
            importNames: ["useSnackbar"],
            message:
              "Please use the custom src/components/hooks/useSnackbar hook instead.",
          },
        ],
        patterns: [
          ...noRestrictedImportsConfig.patterns,
          {
            group: ["@mui/material/*"],
            message:
              "Please import from @mui/material instead (this will be still tree-shaken).",
          },
        ],
      },
    ],
  },
};
