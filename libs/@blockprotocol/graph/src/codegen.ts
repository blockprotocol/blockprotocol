/**
 * Defines utilities for generating TypeScript types from elements of the Block Protocol Type System.
 */
import { InitializeContext, PreprocessContext } from "./codegen/context.js";
import { initialize } from "./codegen/initialize.js";
import { CodegenParameters } from "./codegen/parameters.js";
import { preprocess } from "./codegen/preprocess.js";
import { LogLevel } from "./codegen/shared.js";

export const codegen = async (
  params: CodegenParameters,
  logLevel: LogLevel = "info",
) => {
  const initializeContext = new InitializeContext(params, logLevel);
  await initialize(initializeContext);

  const preProcessContext = new PreprocessContext(initializeContext);
  preprocess(preProcessContext);
};
