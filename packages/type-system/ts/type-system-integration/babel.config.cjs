module.exports = {
  presets: [
    [
      '@babel/preset-env',
    ],
  ],
  plugins: [
    ["@babel/transform-runtime"], ["babel-plugin-transform-import-meta"]
  ]
};