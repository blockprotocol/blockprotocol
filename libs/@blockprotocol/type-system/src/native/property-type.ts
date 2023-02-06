import {
  Array as TypeSystemArray,
  OneOf,
  PropertyType,
  PropertyValues,
  VersionedUri,
} from "../../wasm/type-system";

/**
 * Type guard to determine if a given {@link PropertyValues} is an array definition.
 *
 * @param {PropertyValues} propertyValues
 */
export const isPropertyValuesArray = (
  propertyValues: PropertyValues,
): propertyValues is TypeSystemArray<OneOf<PropertyValues>> =>
  "type" in propertyValues && propertyValues.type === "array";

/**
 * Returns all the IDs of all types referenced in a given property type.
 *
 * @param {PropertyType} propertyType
 */
export const getReferencedIdsFromPropertyType = (
  propertyType: PropertyType,
): {
  constrainsValuesOnDataTypes: VersionedUri[];
  constrainsPropertiesOnPropertyTypes: VersionedUri[];
} => {
  const recurseOneOf = (oneOf: PropertyValues[]) => {
    const constrainsValuesOnDataTypes: VersionedUri[] = [];
    const constrainsPropertiesOnPropertyTypes: VersionedUri[] = [];

    for (const oneOfValue of oneOf) {
      if (isPropertyValuesArray(oneOfValue)) {
        const nestedIds = recurseOneOf(oneOfValue.items.oneOf);
        constrainsPropertiesOnPropertyTypes.push(
          ...nestedIds.constrainsPropertiesOnPropertyTypes,
        );
        constrainsValuesOnDataTypes.push(
          ...nestedIds.constrainsValuesOnDataTypes,
        );
      } else if ("properties" in oneOfValue) {
        // property type object definition
        for (const propertyDefinition of Object.values(oneOfValue.properties)) {
          if ("items" in propertyDefinition) {
            constrainsPropertiesOnPropertyTypes.push(
              propertyDefinition.items.$ref,
            );
          } else {
            constrainsPropertiesOnPropertyTypes.push(propertyDefinition.$ref);
          }
        }
      } else {
        // data type reference
        constrainsValuesOnDataTypes.push(oneOfValue.$ref);
      }
    }

    return { constrainsValuesOnDataTypes, constrainsPropertiesOnPropertyTypes };
  };

  return { ...recurseOneOf(propertyType.oneOf) };
};
