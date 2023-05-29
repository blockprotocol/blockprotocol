/**
 * Defines utilities for generating TypeScript types from elements of the Block Protocol Type System.
 */
import * as path from "node:path";

import { VersionedUrl } from "@blockprotocol/type-system";

import { compile } from "./codegen/compile.js";
import {
  CompileContext,
  InitializeContext,
  PostprocessContext,
  PreprocessContext,
} from "./codegen/context.js";
import { initialize } from "./codegen/initialize.js";
import { CodegenParameters } from "./codegen/parameters.js";
import { postprocess } from "./codegen/postprocess.js";
import { preprocess } from "./codegen/preprocess.js";
import { LogLevel } from "./codegen/shared.js";

export {
  type CodegenParameters,
  validateCodegenParameters,
} from "./codegen/parameters.js";

export const collateSchema = async (schemaUrl: VersionedUrl) => {
  const context = new InitializeContext({
    schemaUrl,
    targets: {},
    outputFolder: "",
    logLevel: "info",
  });

  await initialize(context);

  return context;
};

export const codegen = async (
  params: CodegenParameters,
  logLevel: LogLevel = "info",
): Promise<string[]> => {
  const initializeContext = new InitializeContext(params, logLevel);
  await initialize(initializeContext);

  const preProcessContext = new PreprocessContext(initializeContext);
  preprocess(preProcessContext);

  const compileContext = new CompileContext(preProcessContext);
  await compile(compileContext);

  const postProcessContext = new PostprocessContext(compileContext);
  await postprocess(postProcessContext);

  // Return all modified files
  return Object.keys(postProcessContext.filesToContents).map((fileName) =>
    path.resolve(postProcessContext.parameters.outputFolder, fileName),
  );
};
