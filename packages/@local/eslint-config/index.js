/** @type {import("eslint").Linter.Config} */
module.exports = {
  // this is the highest config lower ones will automatically extend
  root: true,
  reportUnusedDisableDirectives: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "jest",
    "simple-import-sort",
    "unicorn",
  ],
  extends: ["plugin:@typescript-eslint/base", "airbnb", "prettier"],
  ignorePatterns: ["**/*.gen.*"],
  globals: {
    NodeJS: true,
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
    curly: ["error", "all"],
    "no-unused-vars": [
      "error",
      {
        args: "all", // check all args, not just those after-used
        argsIgnorePattern: "^_+",
        varsIgnorePattern: "^_+",
      },
    ],
    "default-param-last": "off", // using @typescript-eslint/default-param-last instead
    "no-await-in-loop": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": [
      "error",
      {
        // graph uses 'exports' field in package.json https://github.com/import-js/eslint-plugin-import/issues/1810
        ignore: ["^https?://", "^@blockprotocol/graph", "^@blockprotocol/hook"],
      },
    ],
    "import/prefer-default-export": "off",
    "no-console": "error",
    "no-dupe-class-members": "off",
    "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }], // <style jsx global> is valid
    "react/prop-types": "off",
    // because we are using typescript this is redundant
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        assert: "either",
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message:
              "Please import lodash functions from lodash/functionName for CJS/ESM interop. Check if your task needs lodash at https://you-dont-need.github.io/You-Dont-Need-Lodash-Underscore/#/",
          },
        ],
        patterns: [
          {
            group: ["fs", "fs/*"],
            message:
              "Please use 'fs-extra' for promise-based API, extra methods and consistency.",
          },
        ],
      },
    ],
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
        extensions: [".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"],
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
    "unicorn/filename-case": "error",
    "unicorn/import-style": [
      "error",
      {
        styles: {
          react: { named: true },
          "react-dom": { named: true },
        },
      },
    ],
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
        extensions: [".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"],
      },
    },
  },
  overrides: [
    {
      files: ["**/*.{c,m,}js"],
      parser: "@babel/eslint-parser", // disables typescript rules
      parserOptions: {
        requireConfigFile: false,
        extraFileExtensions: [".cjs"],
        babelOptions: {
          presets: ["@babel/preset-react"], // allows jsx
        },
      },
    },
    {
      files: ["*.test.{j,t}s{x,}"],
      env: {
        jest: true,
        node: true,
      },
    },
    {
      files: [
        "*.config.{c,m,}{j,t}s",
        "*.d.ts",
        "*rc.{c,m,}js",
        "*.test.{j,t}s{,x}",
        "tests/**",
      ],
      rules: {
        "global-require": "off",
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
      },
    },
    {
      files: ["scripts/**"],
      rules: {
        "import/no-extraneous-dependencies": [
          "error",
          { devDependencies: true },
        ],
        "no-console": "off",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off", // replaced by @typescript-eslint/no-unused-vars
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
