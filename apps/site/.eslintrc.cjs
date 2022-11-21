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
        patterns: [
          ...noRestrictedImportsConfig.patterns,
          {
            group: [
              "playwright",
              "@playwright/test",
              "playwright-test-coverage",
            ],
            message:
              "Please import Playwright resources from `[site]/tests/shared/runtime/runtime.js`",
          },
        ],
        paths: [
          ...noRestrictedImportsConfig.paths,
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
      files: ["tests/**"],
      rules: {
        "import/no-extraneous-dependencies": ["off"],
      },
    },
  ],
};
