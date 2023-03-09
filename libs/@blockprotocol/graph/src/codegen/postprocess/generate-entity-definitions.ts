import { VersionedUrl } from "@blockprotocol/type-system/slim";

import { mustBeDefined } from "../../shared/util/must-be-defined.js";
import { typedEntries } from "../../shared/util/typed-object-iter.js";
import { PostprocessContext } from "../context/postprocess.js";
import { entityDefinitionNameForEntityType } from "../shared.js";

const generateDefinitionForEntity = (
  fileName: string,
  entityTypeId: VersionedUrl,
  context: PostprocessContext,
) => {
  const typeName = mustBeDefined(context.entityTypes[entityTypeId]).title;
  const isLinkType = mustBeDefined(context.linkTypeMap[entityTypeId]);

  const linkSuffix = isLinkType ? ` & { linkData: LinkData }` : "";
  const entityName = entityDefinitionNameForEntityType(typeName);

  context.logTrace(
    `Adding${isLinkType ? " link " : " "}entity definition for ${entityName}`,
  );

  mustBeDefined(context.filesToContents[fileName]);
  const compiledContents = `\nexport type ${entityName} = Entity<${typeName}>${linkSuffix}\n`;

  context.defineIdentifierInFile(
    entityName,
    {
      definingPath: fileName,
      dependentOnIdentifiers: isLinkType ? ["Entity", "LinkData"] : ["Entity"],
      compiledContents,
    },
    true,
  );
};

/**
 * Generates types for the definition of various `Entity` kinds, alongside their entity type definitions.
 *
 * @param context
 */
export const generateEntityDefinitions = (
  context: PostprocessContext,
): void => {
  context.logDebug("Adding entity definitions");

  const entityTypeIdentifiersToIds = Object.fromEntries(
    typedEntries(context.entityTypes).map(([entityTypeId, { title }]) => [
      title,
      entityTypeId,
    ]),
  );

  for (const [file, definedIdentifiers] of Object.entries(
    context.filesToDefinedIdentifiers,
  )) {
    for (const identifier of definedIdentifiers) {
      const entityTypeId = entityTypeIdentifiersToIds[identifier];
      if (entityTypeId) {
        generateDefinitionForEntity(file, entityTypeId, context);
      }
    }
  }
};
