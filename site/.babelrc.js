module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-env": {
          targets: {
            chrome: "73",
          },
          // https://github.com/vercel/next.js/issues/17273#issuecomment-700700214
          // Can be removed after upgrading to Next 12
          include: [
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-proposal-nullish-coalescing-operator",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-logical-assignment-operators",
          ],
        },
      },
    ],
  ],
  plugins: ["inline-react-svg"],
};
