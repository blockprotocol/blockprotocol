import { EntityType, VersionedUri } from "../../wasm/type-system";

/**
 * Returns all the IDs of all types referenced in a given property type.
 *
 * @param {EntityType} entityType
 */
export const getReferencedIdsFromEntityType = (
  entityType: EntityType,
): {
  constrainsPropertiesOnPropertyTypes: VersionedUri[];
  constrainsLinksOnEntityTypes: VersionedUri[];
  constrainsLinkDestinationsOnEntityTypes: VersionedUri[];
} => {
  const constrainsPropertiesOnPropertyTypes: Set<VersionedUri> = new Set();
  const constrainsLinksOnEntityTypes: Set<VersionedUri> = new Set();
  const constrainsLinkDestinationsOnEntityTypes: Set<VersionedUri> = new Set();

  for (const propertyDefinition of Object.values(entityType.properties)) {
    if ("items" in propertyDefinition) {
      constrainsPropertiesOnPropertyTypes.add(propertyDefinition.items.$ref);
    } else {
      constrainsPropertiesOnPropertyTypes.add(propertyDefinition.$ref);
    }
  }
  // for (const inheritedEntityType of entityType.allOf ?? []) {
  //   values.push(inheritedEntityType.$ref)
  // }

  for (const [linkTypeId, linkDefinition] of Object.entries(
    entityType.links ?? {},
  )) {
    /** @todo - if we had the `typedEntries` helper here we wouldn't need this cast */
    constrainsLinksOnEntityTypes.add(linkTypeId as VersionedUri);

    if (linkDefinition.items.oneOf !== undefined) {
      linkDefinition.items.oneOf
        .map((oneOfEntry) => oneOfEntry.$ref)
        .forEach((ele) => constrainsLinkDestinationsOnEntityTypes.add(ele));
    }
  }

  return {
    constrainsPropertiesOnPropertyTypes: [
      ...constrainsPropertiesOnPropertyTypes,
    ],
    constrainsLinksOnEntityTypes: [...constrainsLinksOnEntityTypes],
    constrainsLinkDestinationsOnEntityTypes: [
      ...constrainsLinkDestinationsOnEntityTypes,
    ],
  };
};
