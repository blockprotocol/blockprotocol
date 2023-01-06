const deduplicateTypeScriptString = (
  firstString: string,
  secondString: string,
) => {
  let deduplicatedSecondString = secondString;

  const textLines = secondString.split("\n");
  for (let i = 0; i < textLines.length; i++) {
    const line = textLines[i];
    const isLineStartingType = line?.startsWith("export type");
    const isLineStartingInterface = line?.startsWith("export interface");

    if (line && (isLineStartingType || isLineStartingInterface)) {
      const definitionOpensBrace =
        isLineStartingInterface ||
        (!line.endsWith(";") && // this is not a one-line type definition
          // type names are not wrapped, so any opening brace will be on the opening or next line
          (line.includes("{") || textLines[i + 1]?.includes("{")));
      const indexOfLastLineDefiningType = textLines.findIndex(
        (lineToCheck, indexToCheck) =>
          (indexToCheck === i && lineToCheck.endsWith(";")) ||
          (indexToCheck >= i &&
            lineToCheck.trim().startsWith(definitionOpensBrace ? "}" : ";")),
      );
      const typeDefinitionString = textLines
        .slice(i, indexOfLastLineDefiningType + 1)
        .join("\n");
      if (firstString.includes(typeDefinitionString)) {
        deduplicatedSecondString = deduplicatedSecondString.replace(
          typeDefinitionString,
          "",
        );
      }
    }
  }
  return `${firstString}\n${deduplicatedSecondString}`;
};

/**
 * naive approach to de-deduplicate TypeScript definition strings
 * relies on known constants in how json-schema-to-typescript generates types
 * would be more robust with proper parsing
 * @todo check this with more complex schemas
 * @todo detect and remove duplicate comment strings
 */
export const deduplicateTypeScriptStrings = (strings: string[]) => {
  let deduplicatedString = strings[0] ?? "";
  for (let i = 1; i < strings.length; i++) {
    deduplicatedString = deduplicateTypeScriptString(
      deduplicatedString!,
      strings[i]!,
    );
  }
  return deduplicatedString;
};
