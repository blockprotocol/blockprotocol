import {
  BlockProtocolAggregateEntitiesFunction,
  BlockProtocolAggregateEntityTypesFunction,
  BlockProtocolCreateEntitiesFunction,
  BlockProtocolCreateEntityTypesFunction,
  BlockProtocolCreateLinkedAggregationsFunction,
  BlockProtocolCreateLinksFunction,
  BlockProtocolDeleteEntitiesFunction,
  BlockProtocolDeleteEntityTypesFunction,
  BlockProtocolDeleteLinkedAggregationsFunction,
  BlockProtocolDeleteLinksFunction,
  BlockProtocolEntity,
  BlockProtocolEntityType,
  BlockProtocolFunctions,
  BlockProtocolGetEntitiesFunction,
  BlockProtocolGetEntityTypesFunction,
  BlockProtocolGetLinkedAggregationsFunction,
  BlockProtocolGetLinksFunction,
  BlockProtocolLink,
  BlockProtocolLinkedAggregationDefinition,
  BlockProtocolUpdateEntitiesFunction,
  BlockProtocolUpdateEntityTypesFunction,
  BlockProtocolUpdateLinkedAggregationsFunction,
  BlockProtocolUpdateLinksFunction,
  BlockProtocolUploadFileFunction,
} from "blockprotocol";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultArrayState } from "./useDefaultArrayState";
import {
  filterAndSortEntitiesOrTypes,
  matchEntityIdentifiers,
  matchEntityTypeIdentifiers,
} from "./util";

export type MockData = {
  entities: BlockProtocolEntity[];
  links: BlockProtocolLink[];
  linkedAggregationDefinitions: BlockProtocolLinkedAggregationDefinition[];
  entityTypes: BlockProtocolEntityType[];
};

type MockDataStore = MockData & {
  functions: BlockProtocolFunctions;
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

  const aggregateEntityTypes: BlockProtocolAggregateEntityTypesFunction =
    useCallback(
      async (payload) => filterAndSortEntitiesOrTypes(entityTypes, payload),
      [entityTypes],
    );

  const aggregateEntities: BlockProtocolAggregateEntitiesFunction = useCallback(
    async (payload) => filterAndSortEntitiesOrTypes(entities, payload),
    [entities],
  );

  const createEntities: BlockProtocolCreateEntitiesFunction = useCallback(
    async (actions) => {
      const { newEntities, newLinks } = actions.reduce<{
        newEntities: BlockProtocolEntity[];
        newLinks: BlockProtocolLink[];
      }>(
        (map, action) => {
          const entityId = uuid();
          const { accountId, entityTypeId, entityTypeVersionId } = action;
          const newEntity = {
            accountId,
            entityId,
            entityTypeId,
            entityTypeVersionId,
            ...action.data,
          };
          map.newEntities.push(newEntity);
          const linksToCreate = (action.links ?? []).map((link) => ({
            linkId: uuid(),
            sourceEntityAccountId: accountId,
            sourceEntityId: entityId,
            sourceEntityTypeId: entityTypeId,
            ...link,
          }));
          map.newLinks.push(...linksToCreate);
          return map;
        },
        {
          newEntities: [],
          newLinks: [],
        },
      );
      setEntities((currentEntities) => [...currentEntities, ...newEntities]);
      setLinks((currentLinks) => [...currentLinks, ...newLinks]);
      return newEntities;
    },
    [setEntities, setLinks],
  );

  const getEntities: BlockProtocolGetEntitiesFunction = useCallback(
    async (actions) =>
      actions.map((action) => {
        const foundEntity = entities.find((entity) =>
          matchEntityIdentifiers({
            entityToCheck: entity,
            providedIdentifiers: action,
          }),
        );
        if (!foundEntity) {
          throw new Error(
            `Could not find entity for getEntities action ${JSON.stringify(
              action,
              undefined,
              2,
            )}`,
          );
        }
        return foundEntity;
      }),
    [entities],
  );

  const updateEntities: BlockProtocolUpdateEntitiesFunction = useCallback(
    async (actions) => {
      const updatedEntities: BlockProtocolEntity[] = [];
      setEntities((currentEntities) =>
        currentEntities.map((entity) => {
          const actionToApply = actions.find((action) =>
            matchEntityIdentifiers({
              entityToCheck: entity,
              providedIdentifiers: action,
            }),
          );
          if (actionToApply) {
            const newEntity = {
              ...actionToApply.data,
              accountId: entity.accountId,
              entityId: entity.entityId,
              entityTypeId: entity.entityTypeId,
              entityTypeVersionId: entity.entityTypeVersionId,
            };
            updatedEntities.push(newEntity);
            return newEntity;
          }
          return entity;
        }),
      );
      return updatedEntities;
    },
    [setEntities],
  );

  const deleteEntities: BlockProtocolDeleteEntitiesFunction = useCallback(
    async (actions) => {
      setEntities((currentEntities) =>
        currentEntities.filter((entity) => {
          const operationStatus = new Array(actions.length).fill(false);
          const deleteActionIndex = actions.findIndex((action) =>
            matchEntityIdentifiers({
              entityToCheck: entity,
              providedIdentifiers: action,
            }),
          );
          if (deleteActionIndex > -1) {
            operationStatus[deleteActionIndex] = true;
            return false;
          }
          return true;
        }),
      );
      return new Array(actions.length).fill(true);
    },
    [setEntities],
  );

  const createEntityTypes: BlockProtocolCreateEntityTypesFunction = useCallback(
    async (actions) => {
      const newEntityTypes = actions.map<BlockProtocolEntityType>((action) => {
        const entityTypeId = uuid();
        const { accountId, schema } = action;
        return {
          accountId,
          entityTypeId,
          ...schema,
        } as BlockProtocolEntityType; // @todo fix this – make 'schema' a narrower object in BP types?
      });
      setEntityTypes((currentEntityTypes) => [
        ...currentEntityTypes,
        ...newEntityTypes,
      ]);
      return newEntityTypes;
    },
    [setEntityTypes],
  );

  const getEntityTypes: BlockProtocolGetEntityTypesFunction = useCallback(
    async (actions) =>
      actions.map((action) => {
        const foundEntityType = entityTypes.find((entityType) =>
          matchEntityTypeIdentifiers({
            entityTypeToCheck: entityType,
            providedIdentifiers: action,
          }),
        );
        if (!foundEntityType) {
          throw new Error(
            `Could not find entity type for getEntityTypes action ${JSON.stringify(
              action,
            )}`,
          );
        }
        return foundEntityType;
      }),
    [entityTypes],
  );

  const updateEntityTypes: BlockProtocolUpdateEntityTypesFunction = useCallback(
    async (actions) => {
      const updatedEntityTypes: BlockProtocolEntityType[] = [];
      setEntityTypes((currentEntityTypes) =>
        currentEntityTypes.map((entityType) => {
          const actionToApply = actions.find((action) =>
            matchEntityTypeIdentifiers({
              entityTypeToCheck: entityType,
              providedIdentifiers: action,
            }),
          );
          if (actionToApply) {
            const newEntityType = {
              ...actionToApply.schema,
              accountId: entityType.accountId,
              entityTypeId: entityType.entityTypeId,
            } as BlockProtocolEntityType;
            updatedEntityTypes.push(newEntityType);
            return newEntityType;
          }
          return entityType;
        }),
      );
      return updatedEntityTypes;
    },
    [setEntityTypes],
  );

  const deleteEntityTypes: BlockProtocolDeleteEntityTypesFunction = useCallback(
    async (actions) => {
      const operationStatus = new Array(actions.length).fill(false);
      setEntityTypes((currentEntityTypes) =>
        currentEntityTypes.filter((entityType) => {
          const deleteActionIndex = actions.findIndex((action) =>
            matchEntityTypeIdentifiers({
              entityTypeToCheck: entityType,
              providedIdentifiers: action,
            }),
          );
          if (deleteActionIndex > -1) {
            operationStatus[deleteActionIndex] = true;
            return true;
          }
          return true;
        }),
      );
      return operationStatus;
    },
    [setEntityTypes],
  );

  const createLinks: BlockProtocolCreateLinksFunction = useCallback(
    async (actions) => {
      const newLinks = actions.map((action) => ({
        linkId: uuid(),
        ...action,
      }));
      setLinks((currentLinks) => [...currentLinks, ...newLinks]);
      return newLinks;
    },
    [setLinks],
  );

  const getLinks: BlockProtocolGetLinksFunction = useCallback(
    async (actions) =>
      actions.map(({ linkId }) => {
        const foundLink = links.find((link) => link.linkId === linkId);
        if (!foundLink) {
          throw new Error(`link with linkId '${linkId}' not found.`);
        }
        return foundLink;
      }),
    [links],
  );

  const updateLinks: BlockProtocolUpdateLinksFunction = useCallback(
    async (actions) => {
      const updatedLinks: BlockProtocolLink[] = [];
      setLinks((currentLinks) =>
        currentLinks.map((link) => {
          const actionToApply = actions.find(
            (action) => link.linkId === action.linkId,
          );
          if (actionToApply) {
            const newLink = { ...link, index: actionToApply.data.index };
            updatedLinks.push(newLink);
            return newLink;
          }
          return link;
        }),
      );
      return updatedLinks;
    },
    [setLinks],
  );

  const deleteLinks: BlockProtocolDeleteLinksFunction = useCallback(
    async (actions) => {
      setLinks((currentLinks) =>
        currentLinks
          .map((link) => {
            const isMatch = actions.some(
              (action) => action.linkId === link.linkId,
            );
            if (isMatch) {
              return null;
            }
            return link;
          })
          .filter((link): link is BlockProtocolLink => !!link),
      );
      return new Array(actions.length).fill(true);
    },
    [setLinks],
  );

  const createLinkedAggregations: BlockProtocolCreateLinkedAggregationsFunction =
    useCallback(
      async (actions) => {
        const newLinkedAggregations = actions.map((action) => ({
          aggregationId: uuid(),
          ...action,
        }));
        setLinkedAggregations((currentLinkedAggregations) => [
          ...currentLinkedAggregations,
          ...newLinkedAggregations,
        ]);
        return newLinkedAggregations;
      },
      [setLinkedAggregations],
    );

  const getLinkedAggregations: BlockProtocolGetLinkedAggregationsFunction =
    useCallback(
      async (actions) =>
        actions.map(({ aggregationId }) => {
          const foundLinkedAggregation = linkedAggregations.find(
            (linkedAggregation) =>
              linkedAggregation.aggregationId === aggregationId,
          );
          if (!foundLinkedAggregation) {
            throw new Error(
              `LinkedAggregation with aggregationId '${aggregationId}' not found.`,
            );
          }
          return {
            ...foundLinkedAggregation,
            ...filterAndSortEntitiesOrTypes(entities, foundLinkedAggregation),
          };
        }),
      [entities, linkedAggregations],
    );

  const updateLinkedAggregations: BlockProtocolUpdateLinkedAggregationsFunction =
    useCallback(
      async (actions) => {
        const updatedLinkedAggregations: BlockProtocolLinkedAggregationDefinition[] =
          [];
        setLinkedAggregations((currentLinkedAggregations) =>
          currentLinkedAggregations.map((linkedAggregation) => {
            const actionToApply = actions.find(
              (action) =>
                linkedAggregation.aggregationId === action.aggregationId,
            );
            if (actionToApply) {
              const newLinkedAggregation = {
                ...linkedAggregation,
                operation: actionToApply.operation,
              };
              updatedLinkedAggregations.push(newLinkedAggregation);
              return newLinkedAggregation;
            }
            return linkedAggregation;
          }),
        );
        return updatedLinkedAggregations;
      },
      [setLinkedAggregations],
    );

  const deleteLinkedAggregations: BlockProtocolDeleteLinkedAggregationsFunction =
    useCallback(
      async (actions) => {
        setLinkedAggregations((currentLinkedAggregations) =>
          currentLinkedAggregations
            .map((linkedAggregation) => {
              const isMatch = actions.some(
                (action) =>
                  action.aggregationId === linkedAggregation.aggregationId,
              );
              if (isMatch) {
                return null;
              }
              return linkedAggregation;
            })
            .filter(
              (
                linkedAggregation,
              ): linkedAggregation is BlockProtocolLinkedAggregationDefinition =>
                !!linkedAggregation,
            ),
        );
        return new Array(actions.length).fill(true);
      },
      [setLinkedAggregations],
    );

  const uploadFile: BlockProtocolUploadFileFunction = useCallback(
    async ({ accountId, file, url, mediaType }) => {
      if (!file && !url?.trim()) {
        throw new Error(
          `Please enter a valid ${mediaType} URL or select a file below`,
        );
      }

      if (url?.trim()) {
        return createEntities([
          {
            accountId,
            data: {
              url,
              mediaType,
            },
            entityTypeId: "file1",
          },
        ]).then(
          (resp) =>
            Promise.resolve(
              resp[0],
            ) as ReturnType<BlockProtocolUploadFileFunction>,
        );
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
          return createEntities([
            {
              accountId,
              data: {
                url: result.toString(),
                mediaType,
              },
              entityTypeId: "file1",
            },
          ]).then(
            (resp) =>
              Promise.resolve(
                resp[0],
              ) as ReturnType<BlockProtocolUploadFileFunction>,
          );
        }

        throw new Error("Couldn't read your file");
      }
      throw new Error("Unreachable.");
    },
    [createEntities],
  );

  return {
    entities,
    entityTypes,
    functions: {
      aggregateEntities,
      aggregateEntityTypes,
      getEntities,
      createEntities,
      deleteEntities,
      updateEntities,
      getEntityTypes,
      createEntityTypes,
      deleteEntityTypes,
      updateEntityTypes,
      getLinks,
      createLinks,
      deleteLinks,
      updateLinks,
      getLinkedAggregations,
      createLinkedAggregations,
      deleteLinkedAggregations,
      updateLinkedAggregations,
      uploadFile,
    },
    links,
    linkedAggregationDefinitions: linkedAggregations,
  };
};
