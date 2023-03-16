import {
  BaseUrl,
  DataType,
  EntityType,
  extractBaseUrl,
  extractVersion,
  PropertyType,
} from "@blockprotocol/type-system/slim";
import ts from "typescript";

import { mustBeDefined } from "../../shared/util/must-be-defined.js";
import {
  typedEntries,
  typedKeys,
} from "../../shared/util/typed-object-iter.js";
import { PreprocessContext } from "../context.js";
import { generatedTypeSuffix } from "../shared.js";

const typescriptKeywords = new Array(
  ts.SyntaxKind.LastKeyword - ts.SyntaxKind.FirstKeyword,
)
  .fill(0)
  .map((_, idx) => ts.tokenToString(ts.SyntaxKind.FirstKeyword + idx)!);

const isTypescriptKeyword = (name: string) => {
  return typescriptKeywords.includes(name);
};

/**
 * Extracts the alphanumeric characters from the title and creates a Title Cased version that can be used as a
 * TypeScript identifier
 *
 * @param title
 */
const generateValidTypeScriptIdentifierFromTitle = (title: string): string => {
  /* @todo - Handle acronyms, we should do a non-case-sensitive match and then convert all the groups to lower-case */
  // extract all letters and numbers from the title, and capitalise the start of each component
  const pascalCase = (title.match(/[a-zA-Z0-9]+/g) || [])
    .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join("");

  const typeName = !/[a-zA-Z]/.test(pascalCase.charAt(0))
    ? `T${pascalCase}`
    : pascalCase;

  if (isTypescriptKeyword(typeName)) {
    throw new Error(
      `Internal error: generated type name "${typeName}" is a TypeScript keyword`,
    );
  }

  return typeName;
};

/**
 * **Rewrites** the `title`s of the types to be locally (per file) unique valid javascript identifiers.
 *
 * Clashes are dealt with per class of type, and then per Base Url, and then per revision.
 */
export const rewriteTypeTitles = (context: PreprocessContext) => {
  context.logDebug("Rewriting type titles to be unique...");
  /* eslint-disable no-param-reassign -- the point of this function is to mutate the types in place */
  const typeNamesToTypes: {
    dataType: Record<string, DataType[]>;
    propertyType: Record<string, PropertyType[]>;
    entityType: Record<string, EntityType[]>;
  } = {
    dataType: {},
    propertyType: {},
    entityType: {},
  };

  const typeNameOverrides = context.parameters.typeNameOverrides;

  typedEntries(context.allTypes).forEach(([typeId, type]) => {
    const override = typeNameOverrides[typeId];
    const typeNameFromTitle = generateValidTypeScriptIdentifierFromTitle(
      override ?? type.title,
    );

    if (override && typeNameFromTitle !== override) {
      context.logWarn(
        `Type name override of "${override}" for "${typeId}" isn't in PascalCase, using "${typeNameFromTitle}" instead.`,
      );
    }

    typeNamesToTypes[type.kind][typeNameFromTitle] ??= [];
    // This `any` is safe as we just checked the `kind`
    typeNamesToTypes[type.kind][typeNameFromTitle]!.push(type as any);
  });

  for (const [typeKind, nameMap] of typedEntries(typeNamesToTypes)) {
    for (const [typeName, typesForName] of typedEntries(nameMap)) {
      if (typesForName.length > 1) {
        // Group them by their BaseUrl
        const baseUrlToTypes: Record<BaseUrl, typeof typesForName> = {};

        for (const type of typesForName) {
          const baseUrl = extractBaseUrl(type.$id);
          baseUrlToTypes[baseUrl] ??= [];
          // This `any` is safe as we're literally passing the same type back in, TS is just confused by the disjoint
          // union of `DataType[] | PropertyType[] | EntityType[]`
          baseUrlToTypes[baseUrl]!.push(type as any);
        }

        if (typedKeys(baseUrlToTypes).length > 1) {
          // They're not all the same BaseUrl so we need to differentiate the different types, and then the different
          // revisions of the types
          /* @todo - Add option to pass in a named capture-group regex which can extract more components */
          for (const [index, [_baseUrl, typesOfBaseUrl]] of typedEntries(
            typedEntries(baseUrlToTypes),
          )) {
            if (typesOfBaseUrl.length > 1) {
              for (const currentTypeRevision of typesOfBaseUrl) {
                // We have multiple revisions of this type, so we need to differentiate it from the other types with the
                // same title, and then also from its other revisions
                currentTypeRevision.title = `${typeName}${index}V${extractVersion(
                  currentTypeRevision.$id,
                )}`;
              }
            } else {
              // We only have one revision of this type, so we only need to differentiate it from the other types with
              // the same title
              mustBeDefined(typesOfBaseUrl[0]).title = `${typeName}${index}`;
            }
          }
        } else {
          // They're all revisions of the same type (same Base URL) so we can just differentiate them by their version
          mustBeDefined(Object.values(baseUrlToTypes).pop()).forEach((type) => {
            type.title = `${typeName}V${extractVersion(type.$id)}`;
          });
        }
      } else {
        mustBeDefined(typesForName[0]).title = typeName;
      }

      typesForName.forEach((type) => {
        type.title += generatedTypeSuffix[typeKind];
        if (isTypescriptKeyword(type.title)) {
          type.title += "Type";
        }
        context.logTrace(`Renamed the title of ${type.$id} to ${type.title}`);
      });
    }
  }

  /* eslint-enable no-param-reassign */
};
