const path = require("node:path");
const webpack = require("webpack");

const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./plugin/trunk/block/index.tsx",
    render: "./plugin/trunk/block/render.tsx",
    "register-variations": "./plugin/trunk/block/register-variations.tsx",
    sentry: "./plugin/trunk/block/sentry.ts",
    settings: "./plugin/trunk/settings/settings.tsx",
  },
  output: {
    path: path.join(__dirname, "./plugin/trunk/build"),
    filename: "[name].js",
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ...(defaultConfig.resolve
        ? defaultConfig.resolve.extensions || [".js", ".jsx"]
        : []),
    ],
  },
  plugins: [
    ...defaultConfig.plugins,
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    ...(process.env.BUNDLE_ANALYZER ? [new BundleAnalyzerPlugin()] : []),
  ],
};
