import {
  EmbedderGraphMessageCallbacks,
  Entity,
  EntityType,
  Link,
  LinkedAggregationDefinition,
  UploadFileReturn,
} from "@blockprotocol/graph";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultArrayState } from "./use-default-array-state";
import { filterAndSortEntitiesOrTypes } from "./util";

export type MockData = {
  entities: Entity[];
  links: Link[];
  linkedAggregationDefinitions: LinkedAggregationDefinition[];
  entityTypes: EntityType[];
};

type MockDataStore = MockData & {
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
};

export const useMockDatastore = (
  initialData: MockData = {
    entities: [],
    links: [],
    linkedAggregationDefinitions: [],
    entityTypes: [],
  },
): MockDataStore => {
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
      [setEntities, setLinks],
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
        let newEntity;
        setEntities((currentEntities) =>
          currentEntities.map((entity) => {
            if (entity.entityId === data.entityId) {
              newEntity = {
                ...entity,
                properties: {
                  ...entity.properties,
                  ...data.properties,
                },
              };
              return newEntity;
            }
            return entity;
          }),
        );
        if (!newEntity) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find entity with entityId '${data.entityId}'`,
              },
            ],
          };
        }
        return { data: newEntity };
      },
      [setEntities],
    );

  const deleteEntity: EmbedderGraphMessageCallbacks["deleteEntity"] =
    useCallback(
      async ({ data }) => {
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
        let deleted = false;
        setEntities((currentEntities) =>
          currentEntities.filter((entity) => {
            if (entity.entityId === data.entityId) {
              deleted = true;
              return false;
            }
            return true;
          }),
        );
        if (!deleted) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find entity with entityId '${data.entityId}'`,
              },
            ],
          };
        }
        return { data: true };
      },
      [setEntities],
    );

  const createEntityType: EmbedderGraphMessageCallbacks["createEntityType"] =
    useCallback(
      async ({ data }) => {
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
      [setEntityTypes],
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
        let newEntityType;
        setEntityTypes((currentEntityTypes) =>
          currentEntityTypes.map((entityType) => {
            if (entityType.entityTypeId === data.entityTypeId) {
              newEntityType = {
                ...entityType,
                schema: {
                  ...entityType.schema,
                  ...data.schema,
                },
              };
              return newEntityType;
            }
            return entityType;
          }),
        );
        if (!newEntityType) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find entity type with entityId '${data.entityTypeId}'`,
              },
            ],
          };
        }
        return { data: newEntityType };
      },
      [setEntityTypes],
    );

  const deleteEntityType: EmbedderGraphMessageCallbacks["deleteEntityType"] =
    useCallback(
      async ({ data }) => {
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
        let deleted = false;
        setEntityTypes((currentEntityTypes) =>
          currentEntityTypes.filter((entityType) => {
            if (entityType.entityTypeId === data.entityTypeId) {
              deleted = true;
              return false;
            }
            return true;
          }),
        );
        if (!deleted) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find entity type with entityTypeId '${data.entityTypeId}'`,
              },
            ],
          };
        }
        return { data: true };
      },
      [setEntityTypes],
    );

  const createLink: EmbedderGraphMessageCallbacks["createLink"] = useCallback(
    async ({ data }) => {
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
    [setLinks],
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
      let updatedLink;
      setLinks((currentLinks) =>
        currentLinks.map((link) => {
          if (link.linkId === data.linkId) {
            updatedLink = { ...link, index: data.data.index };
            return updatedLink;
          }
          return link;
        }),
      );
      if (!updatedLink) {
        return {
          errors: [
            {
              code: "NOT_FOUND",
              message: `Could not find link with linkId '${data.linkId}'`,
            },
          ],
        };
      }
      return { data: updatedLink };
    },
    [setLinks],
  );

  const deleteLink: EmbedderGraphMessageCallbacks["deleteLink"] = useCallback(
    async ({ data }) => {
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
      let deleted = false;
      setLinks((currentLinks) =>
        currentLinks
          .map((link) => {
            if (data.linkId === link.linkId) {
              return null;
            }
            deleted = true;
            return link;
          })
          .filter((link): link is Link => !!link),
      );
      if (!deleted) {
        return {
          errors: [
            {
              code: "NOT_FOUND",
              message: `Could not find link with linkId '${data.linkId}'`,
            },
          ],
        };
      }
      return { data: deleted };
    },
    [setLinks],
  );

  const createLinkedAggregation: EmbedderGraphMessageCallbacks["createLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
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
      [setLinkedAggregations],
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
        let updatedLinkedAggregation: LinkedAggregationDefinition | undefined =
          undefined;
        setLinkedAggregations((currentLinkedAggregations) =>
          currentLinkedAggregations.map((linkedAggregation) => {
            if (linkedAggregation.aggregationId === data.aggregationId) {
              updatedLinkedAggregation = {
                ...linkedAggregation,
                operation: data.operation,
              };
              return updatedLinkedAggregation;
            }
            return linkedAggregation;
          }),
        );
        if (!updatedLinkedAggregation) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find linkedAggregation with aggregationId '${data.aggregationId}'`,
              },
            ],
          };
        }
        return { data: updatedLinkedAggregation };
      },
      [setLinkedAggregations],
    );

  const deleteLinkedAggregation: EmbedderGraphMessageCallbacks["deleteLinkedAggregation"] =
    useCallback(
      async ({ data }) => {
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
        let deleted = false;
        setLinkedAggregations((currentLinkedAggregations) =>
          currentLinkedAggregations
            .map((linkedAggregation) => {
              if (data.aggregationId === linkedAggregation.aggregationId) {
                return null;
              }
              deleted = true;
              return linkedAggregation;
            })
            .filter(
              (
                linkedAggregation,
              ): linkedAggregation is LinkedAggregationDefinition =>
                !!linkedAggregation,
            ),
        );
        if (!deleted) {
          return {
            errors: [
              {
                code: "NOT_FOUND",
                message: `Could not find linkedAggregation with aggregationId '${data.aggregationId}'`,
              },
            ],
          };
        }
        return { data: deleted };
      },
      [setLinkedAggregations],
    );

  const uploadFile: EmbedderGraphMessageCallbacks["uploadFile"] = useCallback(
    async ({ data }) => {
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
    [createEntity],
  );

  return {
    entities,
    entityTypes,
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
