/**
 * Defines utilities for generating TypeScript types from elements of the Block Protocol Type System.
 */
import { InitializeContext } from "./codegen/context.js";
import { initialize } from "./codegen/initialize.js";
import { CodegenParameters } from "./codegen/parameters.js";
import { LogLevel } from "./codegen/shared.js";

export const codegen = async (
  params: CodegenParameters,
  logLevel: LogLevel = "info",
) => {
  const initializeContext = new InitializeContext(params, logLevel);
  await initialize(initializeContext);
};
