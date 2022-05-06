const sharedNoRestrictedImportsConfig = {
  paths: [],
  patterns: [
    {
      group: ["fs", "fs/*"],
      message:
        "Please use 'fs-extra' for promise-based API, extra methods and consistency.",
    },
  ],
};

module.exports = {
  // this is the highest config lower ones will automatically extend
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "jest",
    "simple-import-sort",
    "unicorn",
  ],
  extends: [
    "plugin:@typescript-eslint/base",
    "airbnb",
    "prettier",
    // mutes eslint rules conflicting w/ prettier (requires eslint-config-prettier)
  ],
  ignorePatterns: ["**/*.gen.*"],
  globals: {
    NodeJS: true,
    React: true,
    JSX: true,
    FixMeLater: "readonly",
    globalThis: "readonly",
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "no-undef-init": "off",
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "no-restricted-syntax": "off",
    camelcase: "off",
    "default-param-last": "off", // using @typescript-eslint/default-param-last instead
    "no-await-in-loop": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "error",
    "import/prefer-default-export": "off",
    "no-console": "error",
    "no-dupe-class-members": "off",
    "react/prop-types": "off",
    // because we are using typescript this is redundant
    "jsx-a11y/anchor-is-valid": "off",
    "no-restricted-imports": ["error", sharedNoRestrictedImportsConfig],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ], // because we use next.js empty anchor tags should be used when using the Link component
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "no-void": [
      "error",
      {
        allowAsStatement: true,
      },
    ],
    "no-continue": "off",
    "react/react-in-jsx-scope": "off",
    "no-return-await": "off",
    "max-classes-per-file": "off",
    "lines-between-class-members": [
      "error",
      "always",
      {
        exceptAfterSingleLine: true,
      },
    ],
    "consistent-return": "off",
    "default-case": "off",
    "class-methods-use-this": "off",
    "react/no-unescapted-entities": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-plusplus": "off",
    "prefer-destructuring": "off",
    "no-else-return": "off",
    "arrow-body-style": "off",
    "react/no-unescaped-entities": "off",
    // Other rule changes
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "react/jsx-key": "error",
    "react/jsx-no-useless-fragment": "error",
    "react/self-closing-comp": "error",
    "react/require-default-props": "off",
    "no-shadow": "off",
    "@typescript-eslint/default-param-last": "error",
    // see https://github.com/typescript-eslint/typescript-eslint/issues/2483
    "@typescript-eslint/no-shadow": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "id-length": [
      "error",
      {
        min: 2,
        exceptions: ["_", "x", "y", "z", "a", "b", "i"],
        properties: "never",
      },
    ],
    "no-unused-expressions": "error",
    curly: ["error", "multi-line"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": ["error"],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        minimumDescriptionLength: 10,
      },
    ],
    "no-empty-function": "off",
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsForRegex: ["^draft"],
        ignorePropertyModificationsFor: [
          "acc",
          "accumulator",
          "e",
          "ctx",
          "context",
          "req",
          "request",
          "res",
          "response",
          "$scope",
          "staticContext",
        ],
      },
    ],
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": ["error"],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unicorn/prefer-node-protocol": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.js"],
      parser: "@babel/eslint-parser", // disables typescript rules
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"], // allows jsx
        },
      },
    },
    {
      // top-level config files
      files: ["*.config.js", "*rc.js"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "global-require": "off",
      },
    },
    {
      files: ["packages/**"],
      rules: {
        "unicorn/filename-case": "error",
      },
    },
    {
      files: ["packages/block-scripts/**"],
      rules: {
        "no-console": "off",
        "import/extensions": ["error", "always"],
      },
    },
    {
      files: ["packages/block-template/**"],
      parserOptions: {
        project: ["packages/block-template/tsconfig.json"],
      },
    },
    {
      files: ["packages/block-template/src/dev.js"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
    {
      files: ["packages/react-block-loader/dev/*"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
    {
      files: ["packages/blockprotocol/**"],
      parserOptions: {
        project: ["packages/blockprotocol/tsconfig.json"],
      },
    },
    {
      files: ["packages/mock-block-dock/**"],
      parserOptions: {
        project: ["packages/mock-block-dock/tsconfig.json"],
      },
    },
    {
      files: ["site/**"],
      parserOptions: {
        tsconfigRootDir: `${__dirname}/site`,
        project: "tsconfig.json",
      },
      rules: {
        "no-restricted-imports": [
          "error",
          {
            ...sharedNoRestrictedImportsConfig,
            paths: [
              ...sharedNoRestrictedImportsConfig.paths,
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
                importNames: ["Button", "TextField", "Popover"],
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
            ],
          },
        ],
      },
    },
    {
      files: ["site/src/pages/**"],
      rules: {
        "unicorn/filename-case": "error",
      },
    },
    {
      files: ["**/scripts/**"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
        "no-console": "off",
      },
    },
    {
      files: ["**/__mocks__/*", "*.test.ts", "*.test.tsx"],
      env: {
        "jest/globals": true,
      },
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off",
        // replaced by @typescript-eslint/no-unused-vars
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_+",
            varsIgnorePattern: "^_+",
          },
        ],
        "@typescript-eslint/no-floating-promises": "error",
      },
    },
  ],
};
