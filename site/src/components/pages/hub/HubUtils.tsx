import { FC } from "react";

/** @todo type as JSON Schema. */
export type BlockSchema = Record<string, any>;
export type BlockDependency = keyof typeof blockDependencies;
export type BlockExports = {
  default: FC;
};

/* eslint-disable global-require */
export const blockDependencies = {
  react: require("react"),
  "react-dom": require("react-dom"),
  twind: require("twind"),
  lodash: require("lodash"),
};

// @todo implement getembedblock
export async function getEmbedBlock(): Promise<{
  html: string;
  error?: string;
  height?: number;
  width?: number;
} | null> {
  return null;
}
