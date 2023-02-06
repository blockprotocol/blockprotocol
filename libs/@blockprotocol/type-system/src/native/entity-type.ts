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
  const constrainsPropertiesOnPropertyTypes: VersionedUri[] = [];
  const constrainsLinksOnEntityTypes: VersionedUri[] = [];
  const constrainsLinkDestinationsOnEntityTypes: VersionedUri[] = [];

  for (const propertyDefinition of Object.values(entityType.properties)) {
    if ("items" in propertyDefinition) {
      constrainsPropertiesOnPropertyTypes.push(propertyDefinition.items.$ref);
    } else {
      constrainsPropertiesOnPropertyTypes.push(propertyDefinition.$ref);
    }
  }
  // for (const inheritedEntityType of entityType.allOf ?? []) {
  //   values.push(inheritedEntityType.$ref)
  // }

  for (const [linkTypeId, linkDefinition] of Object.entries(
    entityType.links ?? {},
  )) {
    /** @todo - if we had the `typedEntries` helper here we wouldn't need this cast */
    constrainsLinksOnEntityTypes.push(linkTypeId as VersionedUri);

    if ("items" in linkDefinition && "oneOf" in linkDefinition.items) {
      constrainsLinkDestinationsOnEntityTypes.push(
        ...linkDefinition.items.oneOf.map((oneOfEntry) => oneOfEntry.$ref),
      );
    }
  }

  return {
    constrainsPropertiesOnPropertyTypes,
    constrainsLinksOnEntityTypes,
    constrainsLinkDestinationsOnEntityTypes,
  };
};
