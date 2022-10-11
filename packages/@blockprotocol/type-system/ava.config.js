export default {
  extensions: {
    ts: "module",
  },
  files: ["**/*.test.ts"],
  nodeArguments: [
    "--require=@local/script-resources/suppress-experimental-warnings.cjs",
    "--loader=ts-node/esm/transpile-only",
    "--experimental-modules",
    "--experimental-wasm-modules",
    "--experimental-vm-modules",
    "--experimental-specifier-resolution=node",
  ],
};
