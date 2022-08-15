import { TextDecoder, TextEncoder } from 'node:util';
import fetch from "node-fetch";

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  globals: {
    TextDecoder,
    TextEncoder,
    fetch
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!(@blockprotocol/type-system)/)", "/type-system/ts/type-system/"
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest"
  },
};
