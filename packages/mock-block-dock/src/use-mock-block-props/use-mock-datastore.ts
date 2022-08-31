import {
  EmbedderGraphMessageCallbacks,
  Entity,
  EntityType,
  Link,
  LinkedAggregationDefinition,
  UploadFileReturn,
} from "@blockprotocol/graph";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

import { usePrevious } from "../use-previous";
import { filterAndSortEntitiesOrTypes } from "../util";
import { useDefaultArrayState } from "./use-default-array-state";

export type MockData = {
  entities: Entity[];
  links: Link[];
  linkedAggregationDefinitions: LinkedAggregationDefinition[];
  entityTypes: EntityType[];
};

type MockDataStore = MockData & {
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
  blockEntity: Entity;
  setBlockEntity: Dispatch<SetStateAction<Entity>>;
};

const readonlyErrorReturn: {
  errors: [{ code: "FORBIDDEN"; message: string }];
} = {
  errors: [
    {
      code: "FORBIDDEN",
      message: "Operation can't be carried out in read-only mode",
    },
  ],
};

/** default entityId assigned to the block entity if the block entity doesn't have one */
export const defaultBlockEntityId = "block1";

/** default entityTypeId assigned to the block entity if the block entity doesn't have one */
export const defaultBlockEntityTypeId = "block-type-1";

const defaultBlockEntity = {
  entityId: "block1",
  entityTypeId: "block-type-1",
  properties: {},
};

export const useMockDatastore = ({
  initialData,
  readonly,
  externalBlockEntity,
  blockSchema,
}: {
  initialData: MockData;
  readonly?: boolean;
  externalBlockEntity?: Entity;
  blockSchema?: Partial<EntityType>;
}): MockDataStore => {
  const [entities, setEntities] = useDefaultArrayState<
    MockDataStore["entities"]
  >(initialData.entities);
  const [entityTypes, setEntityTypes] = useDefaultArrayState<
    MockDataStore["entityTypes"]
  >(initialData.entityTypes);
  const [links, setLinks] = useDefaultArrayState<MockDataStore["links"]>(
    initialData.links,
  );
  const [linkedAggregations, setLinkedAggregations] = useDefaultArrayState<
    MockDataStore["linkedAggregationDefinitions"]
  >(initialData.linkedAggregationDefinitions);
  const [blockEntity, setBlockEntity] = useState<Entity>(
    externalBlockEntity ?? defaultBlockEntity,
  );
  const prevExternalBlockEntity = usePrevious(externalBlockEntity);
  const prevBlockSchema = usePrevious(blockSchema);

  const aggregateEntityTypes: EmbedderGraphMessageCallbacks["aggregateEntityTypes"] =
    useCallback(
      async (payload) => ({
        data: filterAndSortEntitiesOrTypes(entityTypes, payload.data ?? {}),
      }),
      [entityTypes],
    );

  const aggregateEntities: EmbedderGraphMessageCallbacks["aggregateEntities"] =
    useCallback(
      async (payload) => ({
        data: filterAndSortEntitiesOrTypes(
          entities,
          payload.data ?? { operation: {} },
        ),
      }),
      [entities],
    );

  const createEntity: EmbedderGraphMessageCallbacks["createEntity"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "createEntity requires 'data' input",
              },
            ],
          };
        }
        const entityId = uuid();
        const { entityTypeId, links: newLinks, properties } = data;
        const newEntity: Entity = {
          entityId,
          entityTypeId,
          properties,
        };
        const linksToCreate = (newLinks ?? []).map((link) => ({
          linkId: uuid(),
          sourceEntityId: entityId,
          ...link,
        }));

        setEntities((currentEntities) => [...currentEntities, newEntity]);
        setLinks((currentLinks) => [...currentLinks, ...linksToCreate]);
        return { data: newEntity };
      },
      [setEntities, setLinks, readonly],
    );

  const getEntity: EmbedderGraphMessageCallbacks["getEntity"] = useCallback(
    async ({ data }) => {
      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "getEntity requires 'data' input",
            },
          ],
        };
      }
      const foundEntity = entities.find(
        (entity) => entity.entityId === data.entityId,
      );
      if (!foundEntity) {
        return {
          errors: [
            {
              code: "NOT_FOUND",
              message: `Could not find entity with entityId '${data.entityId}'`,
            },
          ],
        };
      }
      return { data: foundEntity };
    },
    [entities],
  );

  const updateEntity: EmbedderGraphMessageCallbacks["updateEntity"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "updateEntity requires 'data' input",
              },
            ],
          };
        }

        return new Promise((resolve) => {
          setEntities((currentEntities) => {
            if (
              !currentEntities.find(
                ({ entityId }) => entityId === data.entityId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity with entityId '${data.entityId}'`,
                  },
                ],
              });
              return currentEntities;
            }
            return currentEntities.map((entity) => {
              if (entity.entityId === data.entityId) {
                const newEntity = {
                  ...entity,
                  properties: {
                    ...entity.properties,
                    ...data.properties,
                  },
                };
                resolve({ data: newEntity });
                return newEntity;
              }
              return entity;
            });
          });
        });
      },
      [setEntities, readonly],
    );

  const deleteEntity: EmbedderGraphMessageCallbacks["deleteEntity"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "deleteEntity requires 'data' input",
              },
            ],
          };
        }
        return new Promise((resolve) => {
          setEntities((currentEntities) => {
            if (
              !currentEntities.find(
                ({ entityId }) => entityId === data.entityId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity with entityId '${data.entityId}'`,
                  },
                ],
              });
              return currentEntities;
            }
            return currentEntities.filter((entity) => {
              if (entity.entityId === data.entityId) {
                resolve({ data: true });
                return false;
              }
              return true;
            });
          });
        });
      },
      [setEntities, readonly],
    );

  const createEntityType: EmbedderGraphMessageCallbacks["createEntityType"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "createEntityType requires 'data' input",
              },
            ],
          };
        }
        const entityTypeId = uuid();
        const { schema } = data;
        const newEntityType: EntityType = {
          entityTypeId,
          schema,
        };

        setEntityTypes((currentEntityTypes) => [
          ...currentEntityTypes,
          newEntityType,
        ]);
        return { data: newEntityType };
      },
      [setEntityTypes, readonly],
    );

  const getEntityType: EmbedderGraphMessageCallbacks["getEntityType"] =
    useCallback(
      async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "getEntityType requires 'data' input",
              },
            ],
          };
        }
        const foundEntityType = entityTypes.find(
          (entityType) => entityType.entityTypeId === data.entityTypeId,
        );
        if (!foundEntityType) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find entity type with entityTypeId '${data.entityTypeId}'`,
              },
            ],
          };
        }
        return { data: foundEntityType };
      },
      [entityTypes],
    );

  const updateEntityType: EmbedderGraphMessageCallbacks["updateEntityType"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "updateEntityType requires 'data' input",
              },
            ],
          };
        }

        return new Promise((resolve) => {
          setEntityTypes((currentEntityTypes) => {
            if (
              !currentEntityTypes.find(
                ({ entityTypeId }) => entityTypeId === data.entityTypeId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity type with entityTypeId '${data.entityTypeId}'`,
                  },
                ],
              });
              return currentEntityTypes;
            }
            return currentEntityTypes.map((entityType) => {
              if (entityType.entityTypeId === data.entityTypeId) {
                const newEntityType = {
                  ...entityType,
                  schema: {
                    ...entityType.schema,
                    ...data.schema,
                  },
                };
                resolve({ data: newEntityType });
                return newEntityType;
              }
              return entityType;
            });
          });
        });
      },
      [setEntityTypes, readonly],
    );

  const deleteEntityType: EmbedderGraphMessageCallbacks["deleteEntityType"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "deleteEntityType requires 'data' input",
              },
            ],
          };
        }
        return new Promise((resolve) => {
          setEntityTypes((currentEntityTypes) => {
            if (
              !currentEntityTypes.find(
                ({ entityTypeId }) => entityTypeId === data.entityTypeId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity type with entityTypeId '${data.entityTypeId}'`,
                  },
                ],
              });
              return currentEntityTypes;
            }
            return currentEntityTypes.filter((entityType) => {
              if (entityType.entityTypeId === data.entityTypeId) {
                resolve({ data: true });
                return false;
              }
              return true;
            });
          });
        });
      },
      [setEntityTypes, readonly],
    );

  const createLink: EmbedderGraphMessageCallbacks["createLink"] = useCallback(
    async ({ data }) => {
      if (readonly) {
        return readonlyErrorReturn;
      }

      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "createLink requires 'data' input",
            },
          ],
        };
      }
      const newLink = {
        linkId: uuid(),
        ...data,
      };
      setLinks((currentLinks) => [...currentLinks, newLink]);
      return { data: newLink };
    },
    [setLinks, readonly],
  );

  const getLink: EmbedderGraphMessageCallbacks["getLink"] = useCallback(
    async ({ data }) => {
      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "getLink requires 'data' input",
            },
          ],
        };
      }
      const foundLink = links.find((link) => link.linkId === data.linkId);
      if (!foundLink) {
        return {
          errors: [
            {
              code: "NOT_FOUND",
              message: `Could not find link with linkId '${data.linkId}'`,
            },
          ],
        };
      }
      return { data: foundLink };
    },
    [links],
  );

  const updateLink: EmbedderGraphMessageCallbacks["updateLink"] = useCallback(
    async ({ data }) => {
      if (readonly) {
        return readonlyErrorReturn;
      }

      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "updateLink requires 'data' input",
            },
          ],
        };
      }
      return new Promise((resolve) => {
        setLinks((currentLinks) => {
          if (!currentLinks.find(({ linkId }) => linkId === data.linkId)) {
            resolve({
              errors: [
                {
                  code: "NOT_FOUND",
                  message: `Could not find link with linkId '${data.linkId}'`,
                },
              ],
            });
            return currentLinks;
          }
          return currentLinks.map((link) => {
            if (link.linkId === data.linkId) {
              const newLink = {
                ...link,
                index: data.data.index,
              };
              resolve({ data: newLink });
              return newLink;
            }
            return link;
          });
        });
      });
    },
    [setLinks, readonly],
  );

  const deleteLink: EmbedderGraphMessageCallbacks["deleteLink"] = useCallback(
    async ({ data }) => {
      if (readonly) {
        return readonlyErrorReturn;
      }

      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "deleteLink requires 'data' input",
            },
          ],
        };
      }
      return new Promise((resolve) => {
        setLinks((currentLinks) => {
          if (!currentLinks.find(({ linkId }) => linkId === data.linkId)) {
            resolve({
              errors: [
                {
                  code: "NOT_FOUND",
                  message: `Could not find link with linkId '${data.linkId}'`,
                },
              ],
            });
            return currentLinks;
          }
          return currentLinks.filter((link) => {
            if (link.linkId === data.linkId) {
              resolve({ data: true });
              return false;
            }
            return true;
          });
        });
      });
    },
    [setLinks, readonly],
  );

  const createLinkedAggregation: EmbedderGraphMessageCallbacks["createLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "createLinkedAggregation requires 'data' input",
              },
            ],
          };
        }
        const newLinkedAggregation = {
          aggregationId: uuid(),
          ...data,
        };
        setLinkedAggregations((currentLinkedAggregations) => [
          ...currentLinkedAggregations,
          newLinkedAggregation,
        ]);
        return { data: newLinkedAggregation };
      },
      [setLinkedAggregations, readonly],
    );

  const getLinkedAggregation: EmbedderGraphMessageCallbacks["getLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "getLinkedAggregation requires 'data' input",
              },
            ],
          };
        }
        const foundLinkedAggregation = linkedAggregations.find(
          (linkedAggregation) =>
            linkedAggregation.aggregationId === data.aggregationId,
        );
        if (!foundLinkedAggregation) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find linkedAggregation with aggregationId '${data.aggregationId}'`,
              },
            ],
          };
        }
        return {
          data: {
            ...foundLinkedAggregation,
            ...filterAndSortEntitiesOrTypes(entities, foundLinkedAggregation),
          },
        };
      },
      [entities, linkedAggregations],
    );

  const updateLinkedAggregation: EmbedderGraphMessageCallbacks["updateLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "updateLinkedAggregation requires 'data' input",
              },
            ],
          };
        }
        return new Promise((resolve) => {
          setLinkedAggregations((currentLinkedAggregations) => {
            if (
              !currentLinkedAggregations.find(
                ({ aggregationId }) => aggregationId === data.aggregationId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find linked aggregation with aggregationId '${data.aggregationId}'`,
                  },
                ],
              });
              return currentLinkedAggregations;
            }
            return currentLinkedAggregations.map((linkedAggregation) => {
              if (linkedAggregation.aggregationId === data.aggregationId) {
                const newLinkedAggregation = {
                  ...linkedAggregation,
                  operation: data.operation,
                };
                resolve({ data: newLinkedAggregation });
                return newLinkedAggregation;
              }
              return linkedAggregation;
            });
          });
        });
      },
      [setLinkedAggregations, readonly],
    );

  const deleteLinkedAggregation: EmbedderGraphMessageCallbacks["deleteLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
        if (readonly) {
          return readonlyErrorReturn;
        }

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "deleteLinkedAggregation requires 'data' input",
              },
            ],
          };
        }
        return new Promise((resolve) => {
          setLinkedAggregations((currentLinkedAggregations) => {
            if (
              !currentLinkedAggregations.find(
                ({ aggregationId }) => aggregationId === data.aggregationId,
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find link with aggregationId '${data.aggregationId}'`,
                  },
                ],
              });
              return currentLinkedAggregations;
            }
            return currentLinkedAggregations.filter((link) => {
              if (link.aggregationId === data.aggregationId) {
                resolve({ data: true });
                return false;
              }
              return true;
            });
          });
        });
      },
      [setLinkedAggregations, readonly],
    );

  const uploadFile: EmbedderGraphMessageCallbacks["uploadFile"] = useCallback(
    async ({ data }) => {
      if (readonly) {
        return readonlyErrorReturn;
      }

      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "uploadFile requires 'data' input",
            },
          ],
        };
      }
      const { file, url, mediaType } = data;
      if (!file && !url?.trim()) {
        throw new Error(
          `Please enter a valid ${mediaType} URL or select a file below`,
        );
      }

      if (url?.trim()) {
        const resp = await createEntity({
          data: {
            entityTypeId: "file1",
            properties: {
              url,
              mediaType,
            },
          },
        });
        if (resp.errors || !resp.data) {
          return {
            errors: resp.errors ?? [
              {
                code: "INVALID_INPUT",
                message: "Could not create File entity ",
              },
            ],
          };
        }
        const returnData: UploadFileReturn = {
          entityId: resp.data.entityId,
          mediaType,
          url,
        };
        return Promise.resolve({ data: returnData });
      } else if (file) {
        const result = await new Promise<FileReader["result"] | null>(
          (resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
              resolve(event.target?.result ?? null);
            };

            reader.onerror = (event) => {
              reject(event);
            };

            reader.readAsDataURL(file);
          },
        );

        if (result) {
          const resp = await createEntity({
            data: {
              entityTypeId: "file1",
              properties: {
                url: result.toString(),
                mediaType,
              },
            },
          });
          if (resp.errors || !resp.data) {
            return {
              errors: resp.errors ?? [
                {
                  code: "INVALID_INPUT",
                  message: "Could not create File entity ",
                },
              ],
            };
          }
          const returnData: UploadFileReturn = {
            entityId: resp.data.entityId,
            mediaType,
            url: result.toString(),
          };
          return Promise.resolve({ data: returnData });
        }

        throw new Error("Couldn't read your file");
      }
      throw new Error("Unreachable.");
    },
    [createEntity, readonly],
  );

  const updateStore = (newExternalBlockEntity: Entity) => {
    const newEntityTypes = [...entityTypes];
    const entityTypeId =
      newExternalBlockEntity?.entityTypeId ?? defaultBlockEntityTypeId;
    const entityId = newExternalBlockEntity?.entityId ?? defaultBlockEntityId;

    const entityTypeInStore = newEntityTypes.find(
      (entityType) => entityType.entityTypeId === entityTypeId,
    );

    if (entityTypeInStore) {
      // If block schema changed, update entity type
      if (JSON.stringify(blockSchema) !== JSON.stringify(prevBlockSchema)) {
        Object.assign(entityTypeInStore.schema, blockSchema ?? {});
        setEntityTypes(newEntityTypes);
      }
    } else {
      // Create a new entity type if the block's entityTypeId isn't in datastore
      const newBlockEntityType: EntityType = {
        entityTypeId,
        schema: {
          title: "BlockType",
          type: "object",
          $schema: "https://json-schema.org/draft/2019-09/schema",
          $id: `http://localhost/${entityTypeId}`,
          ...(blockSchema ?? {}),
        },
      };
      setEntityTypes([newBlockEntityType, ...entityTypes]);
    }

    const newEntities = [...entities];
    const entityInStore = newEntities.find(
      (entity) =>
        entity.entityId === newExternalBlockEntity.entityId &&
        entity.entityTypeId === newExternalBlockEntity.entityTypeId,
    );

    if (entityInStore) {
      // if block entity exists in store and there was no change, do nothing
      if (
        JSON.stringify(entityInStore.properties) ===
        JSON.stringify(newExternalBlockEntity.properties)
      ) {
        return;
      }

      // If the block entity already exists in the store, and
      // was changed, update what was changed
      Object.assign(
        entityInStore.properties,
        newExternalBlockEntity.properties,
      );
      setEntities(newEntities);
      setBlockEntity(entityInStore);
    } else {
      const newBlockEntity = {
        entityId,
        entityTypeId,
        properties: {},
      };

      if (blockEntity && Object.keys(blockEntity).length > 0) {
        Object.assign(newBlockEntity.properties, blockEntity.properties);
      }

      setEntities([newBlockEntity, ...entities]);
      setBlockEntity(newBlockEntity);
    }
  };

  // Update datastore if block isn't in datastore
  if (
    !entities.find(
      (entity) =>
        entity.entityId === blockEntity.entityId &&
        entity.entityTypeId === blockEntity.entityTypeId,
    ) &&
    [blockEntity.entityId, blockEntity.entityTypeId].every((key) => !!key)
  ) {
    updateStore(blockEntity);
  }

  if (
    externalBlockEntity !== prevExternalBlockEntity &&
    JSON.stringify(blockEntity) !== JSON.stringify(externalBlockEntity)
  ) {
    const entity = externalBlockEntity ?? ({} as Entity);
    // This handles scenarios where the passed in block entity doesn't have an
    // entityId or entityTypeId
    if (!entity.entityId) {
      entity.entityId = defaultBlockEntityId;
    }
    if (!entity.entityTypeId) {
      entity.entityTypeId = defaultBlockEntityTypeId;
    }
    setBlockEntity(entity);
  }

  return {
    entities,
    entityTypes,
    blockEntity,
    setBlockEntity,
    graphServiceCallbacks: {
      aggregateEntities,
      aggregateEntityTypes,
      getEntity,
      createEntity,
      deleteEntity,
      updateEntity,
      getEntityType,
      createEntityType,
      deleteEntityType,
      updateEntityType,
      getLink,
      createLink,
      deleteLink,
      updateLink,
      getLinkedAggregation,
      createLinkedAggregation,
      deleteLinkedAggregation,
      updateLinkedAggregation,
      uploadFile,
    },
    links,
    linkedAggregationDefinitions: linkedAggregations,
  };
};
