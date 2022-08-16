/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transformIgnorePatterns: [
    "/node_modules/", ".*\.wasm"
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
