import {
  EntityType,
  EntityTypeWithMetadata,
  PropertyType,
} from "@blockprotocol/graph";
import { VersionedUri } from "@blockprotocol/type-system/slim";
import {
  EntityTypeEditor,
  EntityTypeEditorProps,
} from "@hashintel/type-editor";
import { useCallback, useEffect, useMemo, useState } from "react";

import { apiClient } from "../../../../../lib/api-client";
import { generateOntologyUri } from "../../../../shared/schema";

type EntityTypeFormProps = {
  author: `@${string}`;
  entityType: EntityTypeWithMetadata;
  readonly: boolean;
};

export const EntityTypeForm = ({
  author,
  entityType,
  readonly: _readonly,
}: EntityTypeFormProps) => {
  const [entityTypeOptions, setEntityTypeOptions] = useState<Record<
    VersionedUri,
    EntityType
  > | null>(null);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<Record<
    VersionedUri,
    PropertyType
  > | null>(null);

  const fetchAndSetEntityTypeOptions = useCallback(async () => {
    const { data: responseData } = await apiClient.getEntityTypes({
      latestOnly: false,
    });

    if (responseData) {
      setEntityTypeOptions(
        responseData.entityTypes.reduce<Record<VersionedUri, EntityType>>(
          (acc, entityTypeOption) => {
            acc[entityTypeOption.schema.$id] = entityTypeOption.schema;

            return acc;
          },
          {},
        ),
      );
    }
  }, [setEntityTypeOptions]);

  const fetchAndSetPropertyTypeOptions = useCallback(async () => {
    const { data: responseData } = await apiClient.getPropertyTypes({
      latestOnly: false,
    });

    if (responseData) {
      setPropertyTypeOptions(
        responseData.propertyTypes.reduce<Record<VersionedUri, PropertyType>>(
          (acc, propertyType) => {
            acc[propertyType.schema.$id] = propertyType.schema;

            return acc;
          },
          {},
        ),
      );
    }
  }, [setPropertyTypeOptions]);

  useEffect(() => {
    void fetchAndSetEntityTypeOptions();
    void fetchAndSetPropertyTypeOptions();
  }, [fetchAndSetEntityTypeOptions, fetchAndSetPropertyTypeOptions]);

  const ontologyFunctions: EntityTypeEditorProps["ontologyFunctions"] =
    useMemo(() => {
      return {
        createEntityType: async ({ data }) => {
          if (!data) {
            throw new Error("No data provided with createEntityType request");
          }

          const { data: createdData, error } = await apiClient.createEntityType(
            {
              schema: data.entityType,
            },
          );

          if (error || !createdData) {
            return {
              errors: [
                {
                  code: "INVALID_INPUT",
                  message: error?.message ?? "Could not create entity type",
                },
              ],
            };
          }

          setEntityTypeOptions((prev) => ({
            ...prev,
            [createdData.entityType.schema.$id]: createdData.entityType.schema,
          }));

          return { data: createdData.entityType };
        },
        createPropertyType: async ({ data }) => {
          if (!data) {
            throw new Error("No data provided with createPropertyType request");
          }

          const { data: createdData, error } =
            await apiClient.createPropertyType({
              schema: data.propertyType,
            });

          if (error || !createdData) {
            return {
              errors: [
                {
                  code: "INVALID_INPUT",
                  message: error?.message ?? "Could not create entity type",
                },
              ],
            };
          }

          setPropertyTypeOptions((prev) => ({
            ...prev,
            [createdData.propertyType.schema.$id]:
              createdData.propertyType.schema,
          }));

          return { data: createdData.propertyType };
        },
        updateEntityType: async ({ data }) => {
          if (!data) {
            throw new Error("No data provided with updateEntityType request");
          }

          const { data: updatedData, error } = await apiClient.updateEntityType(
            {
              versionedUri: data.entityTypeId,
              schema: data.entityType,
            },
          );

          if (error || !updatedData) {
            return {
              errors: [
                {
                  code: "INVALID_INPUT",
                  message: error?.message ?? "Could not update entity type",
                },
              ],
            };
          }

          setEntityTypeOptions((prev) => ({
            ...prev,
            [updatedData.entityType.schema.$id]: updatedData.entityType,
          }));

          return { data: updatedData.entityType };
        },
        updatePropertyType: async ({ data }) => {
          if (!data) {
            throw new Error("No data provided with updatePropertyType request");
          }

          const { data: updatedData, error } =
            await apiClient.updatePropertyType({
              versionedUri: data.propertyTypeId,
              schema: data.propertyType,
            });

          if (error || !updatedData) {
            return {
              errors: [
                {
                  code: "INVALID_INPUT",
                  message: error?.message ?? "Could not update entity type",
                },
              ],
            };
          }

          setEntityTypeOptions((prev) => ({
            ...prev,
            [updatedData.propertyType.schema.$id]: updatedData.propertyType,
          }));

          return { data: updatedData.propertyType };
        },
        validateTitle: async ({ kind, title }) => {
          const { versionedUri } = generateOntologyUri({
            author,
            kind: kind === "entity-type" ? "entityType" : "propertyType",
            title,
            version: 1,
          });

          const fetchFunction =
            kind === "entity-type"
              ? apiClient.getEntityTypeByUri
              : apiClient.getPropertyTypeByUri;

          const { data: existingType } = await fetchFunction({
            versionedUri,
          });

          if (existingType) {
            return {
              allowed: false,
              message: `A ${
                kind === "entity-type" ? "entity" : "property"
              } type with this title already exists: ${
                "entityType" in existingType
                  ? existingType.entityType.schema.$id
                  : existingType.propertyType.schema.$id
              }`,
            };
          }

          return {
            allowed: true,
          };
        },
        // @todo remove this cast when @hashintel/type-editor uses a version of @blockprotocol/graph
        //   that removes the ownedById from OntologyMetadata
      } as EntityTypeEditorProps["ontologyFunctions"];
    }, [author, setEntityTypeOptions, setPropertyTypeOptions]);

  if (!entityTypeOptions || !propertyTypeOptions) {
    return <>Loading...</>;
  }
  return (
    <EntityTypeEditor
      entityType={entityType.schema}
      entityTypeOptions={entityTypeOptions}
      ontologyFunctions={ontologyFunctions}
      propertyTypeOptions={propertyTypeOptions}
    />
  );
};
