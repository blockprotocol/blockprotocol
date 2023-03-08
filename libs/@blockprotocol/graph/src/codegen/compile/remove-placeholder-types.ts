import { typedEntries } from "../../shared/util/typed-object-iter.js";
import { CompileContext } from "../context/compile.js";
import { CompiledTsType } from "../shared.js";

const removePlaceholderDefinitionInCompiledTsType = (
  compiledTsType: CompiledTsType,
): CompiledTsType => compiledTsType.replace(/^.* = "PLACEHOLDER"$/gm, "");

/** Remove the "PLACEHOLDER" definitions left by the workaround of the `$ref` resolver in `compile` */
export const removePlaceholderTypes = (context: CompileContext): void => {
  context.logDebug("Removing placeholder types");

  for (const [typeUrl, compiledTsType] of typedEntries(
    context.urlsToCompiledTypes,
  )) {
    context.urlsToCompiledTypes[typeUrl] =
      removePlaceholderDefinitionInCompiledTsType(compiledTsType);
  }
};
