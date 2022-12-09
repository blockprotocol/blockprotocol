import {
  EmbedderGraphMessageCallbacks,
  Entity,
  UploadFileReturn,
} from "@blockprotocol/graph";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultState } from "../use-default-state";
import { filterAndSortEntitiesOrTypes } from "../util";

export type MockData = {
  entities: Entity[];
  // linkedAggregationDefinitions: LinkedAggregationDefinition[];
};

type MockDataStore = MockData & {
  graphServiceCallbacks: Required<EmbedderGraphMessageCallbacks>;
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

export const useMockDatastore = (
  initialData: MockData = {
    entities: [],
    // linkedAggregationDefinitions: [],
  },
  readonly?: boolean,
): MockDataStore => {
  const [entities, setEntities] = useDefaultState<MockDataStore["entities"]>(
    initialData.entities,
  );

  // const [linkedAggregations, setLinkedAggregations] = useDefaultState<
  //   MockDataStore["linkedAggregationDefinitions"]
  // >(initialData.linkedAggregationDefinitions);

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
                  properties: data.properties,
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

  /** @todo - Reimplement linkedAggregations */
  // const createLinkedAggregation: EmbedderGraphMessageCallbacks["createLinkedAggregation"] =
  //   useCallback(
  //     async ({ data }) => {
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "createLinkedAggregation requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       const newLinkedAggregation = {
  //         aggregationId: uuid(),
  //         ...data,
  //       };
  //       setLinkedAggregations((currentLinkedAggregations) => [
  //         ...currentLinkedAggregations,
  //         newLinkedAggregation,
  //       ]);
  //       return { data: newLinkedAggregation };
  //     },
  //     [setLinkedAggregations, readonly],
  //   );
  //
  // const getLinkedAggregation: EmbedderGraphMessageCallbacks["getLinkedAggregation"] =
  //   useCallback(
  //     async ({ data }) => {
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "getLinkedAggregation requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       const foundLinkedAggregation = linkedAggregations.find(
  //         (linkedAggregation) =>
  //           linkedAggregation.aggregationId === data.aggregationId,
  //       );
  //       if (!foundLinkedAggregation) {
  //         return {
  //           errors: [
  //             {
  //               code: "NOT_FOUND",
  //               message: `Could not find linkedAggregation with aggregationId '${data.aggregationId}'`,
  //             },
  //           ],
  //         };
  //       }
  //       return {
  //         data: {
  //           ...foundLinkedAggregation,
  //           ...filterAndSortEntitiesOrTypes(entities, foundLinkedAggregation),
  //         },
  //       };
  //     },
  //     [entities, linkedAggregations],
  //   );
  //
  // const updateLinkedAggregation: EmbedderGraphMessageCallbacks["updateLinkedAggregation"] =
  //   useCallback(
  //     async ({ data }) => {
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "updateLinkedAggregation requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       return new Promise((resolve) => {
  //         setLinkedAggregations((currentLinkedAggregations) => {
  //           if (
  //             !currentLinkedAggregations.find(
  //               ({ aggregationId }) => aggregationId === data.aggregationId,
  //             )
  //           ) {
  //             resolve({
  //               errors: [
  //                 {
  //                   code: "NOT_FOUND",
  //                   message: `Could not find linked aggregation with aggregationId '${data.aggregationId}'`,
  //                 },
  //               ],
  //             });
  //             return currentLinkedAggregations;
  //           }
  //           return currentLinkedAggregations.map((linkedAggregation) => {
  //             if (linkedAggregation.aggregationId === data.aggregationId) {
  //               const newLinkedAggregation = {
  //                 ...linkedAggregation,
  //                 operation: data.operation,
  //               };
  //               resolve({ data: newLinkedAggregation });
  //               return newLinkedAggregation;
  //             }
  //             return linkedAggregation;
  //           });
  //         });
  //       });
  //     },
  //     [setLinkedAggregations, readonly],
  //   );
  //
  // const deleteLinkedAggregation: EmbedderGraphMessageCallbacks["deleteLinkedAggregation"] =
  //   useCallback(
  //     async ({ data }) => {
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "deleteLinkedAggregation requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       return new Promise((resolve) => {
  //         setLinkedAggregations((currentLinkedAggregations) => {
  //           if (
  //             !currentLinkedAggregations.find(
  //               ({ aggregationId }) => aggregationId === data.aggregationId,
  //             )
  //           ) {
  //             resolve({
  //               errors: [
  //                 {
  //                   code: "NOT_FOUND",
  //                   message: `Could not find link with aggregationId '${data.aggregationId}'`,
  //                 },
  //               ],
  //             });
  //             return currentLinkedAggregations;
  //           }
  //           return currentLinkedAggregations.filter((link) => {
  //             if (link.aggregationId === data.aggregationId) {
  //               resolve({ data: true });
  //               return false;
  //             }
  //             return true;
  //           });
  //         });
  //       });
  //     },
  //     [setLinkedAggregations, readonly],
  //   );

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

  return {
    entities,
    graphServiceCallbacks: {
      aggregateEntities,
      getEntity,
      createEntity,
      deleteEntity,
      updateEntity,
      getEntityType,
      // getLinkedAggregation,
      // createLinkedAggregation,
      // deleteLinkedAggregation,
      // updateLinkedAggregation,
      uploadFile,
    },
    // linkedAggregationDefinitions: linkedAggregations,
  };
};
