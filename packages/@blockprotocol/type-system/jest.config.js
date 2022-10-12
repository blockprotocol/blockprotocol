/** @type {import("jest").Config} */
export default {
  preset: "ts-jest/presets/js-with-babel-esm",
  // transformIgnorePatterns: ["\\.wasm$"],
  transform: {
    "\\.wasm$": "./wasm-transformer.cjs",
  },
  // extensionsToTreatAsEsm: [".ts", ".wasm"],
};
