/* eslint-env node */

module.exports = {
  root: false,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@mui/material",
            importNames: ["Popover"],
            message:
              "Please import { Popover } from 'components/Popover/Popover' instead.",
          },
        ],
      },
    ],
  },
};
