import {
  EmbedderGraphMessageCallbacks,
  Entity,
  Subgraph,
} from "@blockprotocol/graph";
import { addEntitiesToSubgraphByMutation } from "@blockprotocol/graph/internal";
import { getEntity as getEntityFromSubgraph } from "@blockprotocol/graph/stdlib";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultState } from "../use-default-state";
import { aggregateEntities as aggregateEntitiesImpl } from "./hook-implementations/entity/aggregate-entities";
import { getEntity as getEntityImpl } from "./hook-implementations/entity/get-entity";
import { useMockDataToSubgraph } from "./use-mock-data-to-subgraph";

export type MockData = {
  entities: Entity[];
  // linkedAggregationDefinitions: LinkedAggregationDefinition[];
};

export type MockDatastore = {
  graph: Subgraph;
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
): MockDatastore => {
  const mockDataSubgraph = useMockDataToSubgraph(initialData);
  const [graph, setGraph] = useDefaultState(mockDataSubgraph);

  // const [linkedAggregations, setLinkedAggregations] = useDefaultState<
  //   MockDataStore["linkedAggregationDefinitions"]
  // >(initialData.linkedAggregationDefinitions);

  const aggregateEntities: EmbedderGraphMessageCallbacks["aggregateEntities"] =
    useCallback(
      async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "aggregateEntities requires 'data' input",
              },
            ],
          };
        }

        return { data: aggregateEntitiesImpl(data, graph) };
      },
      [graph],
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
        const { entityTypeId, properties, linkData } = data;
        const newEntity: Entity = {
          metadata: {
            recordId: {
              baseId: entityId,
              versionId: new Date().toISOString(),
            },
            entityTypeId,
          },
          properties,
          linkData,
        };

        setGraph((currentGraph) => {
          // A shallow copy should be enough to trigger a re-render
          const newSubgraph = {
            ...currentGraph,
          };
          addEntitiesToSubgraphByMutation(newSubgraph, [newEntity]);
          return newSubgraph;
        });
        return { data: newEntity };
      },
      [readonly, setGraph],
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

      const entitySubgraph = getEntityImpl(data, graph);

      if (!entitySubgraph) {
        return {
          errors: [
            {
              code: "NOT_FOUND",
              message: `Could not find entity with entityId '${data.entityId}'`,
            },
          ],
        };
      }
      return { data: entitySubgraph };
    },
    [graph],
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
          setGraph((currentGraph) => {
            const {
              entityId,
              entityTypeId,
              properties,
              leftToRightOrder,
              rightToLeftOrder,
            } = data;
            const currentEntity = getEntityFromSubgraph(currentGraph, entityId);

            if (currentEntity === undefined) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity with entityId '${data.entityId}'`,
                  },
                ],
              });
              return currentGraph;
            }

            /**
             * @todo - This assumes that once an entity is a link, it's always a link, and its endpoints can't be changed
             *   however we don't enforce this currently. We should probably check the given entityType here
             */
            if (
              (leftToRightOrder || rightToLeftOrder) &&
              !(
                currentEntity.linkData?.leftEntityId &&
                currentEntity.linkData?.rightEntityId
              )
            ) {
              resolve({
                errors: [
                  {
                    code: "INVALID_INPUT",
                    message:
                      "Could not update non-link entity with link metadata (order)",
                  },
                ],
              });
              return currentGraph;
            }

            /**
             * @todo - This assumes that an entity cannot become a link if it didn't start off as one, however we don't
             *    enforce this currently. We should probably check the given entityType here
             */
            const linkData =
              currentEntity.linkData?.leftEntityId &&
              currentEntity.linkData?.rightEntityId
                ? {
                    leftEntityId: currentEntity.linkData.leftEntityId,
                    rightEntityId: currentEntity.linkData.rightEntityId,
                    leftToRightOrder,
                    rightToLeftOrder,
                  }
                : undefined;

            const updatedEntity: Entity = {
              metadata: {
                recordId: {
                  baseId: entityId,
                  versionId: new Date().toISOString(),
                },
                entityTypeId,
              },
              properties,
              linkData,
            };

            // A shallow copy should be enough to trigger a re-render
            const newSubgraph = {
              ...currentGraph,
            };
            resolve({ data: updatedEntity });
            addEntitiesToSubgraphByMutation(newSubgraph, [updatedEntity]);
            return newSubgraph;
          });
        });
      },
      [readonly, setGraph],
    );

  const deleteEntity: EmbedderGraphMessageCallbacks["deleteEntity"] =
    useCallback(
      async ({ data }) => {
        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `Entity deletion is not currently supported`,
            },
          ],
        };

        /** @todo - implement entity deletion */
        // eslint-disable-next-line no-unreachable -- currently unimplemented
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
        return new Promise((_resolve) => {
          setGraph((currentGraph) => {
            // resolve();
            return currentGraph;
          });
        });
      },
      [setGraph, readonly],
    );

  const aggregateEntityTypes: EmbedderGraphMessageCallbacks["aggregateEntityTypes"] =
    useCallback(async ({ data: _ }) => {
      return {
        errors: [
          {
            code: "NOT_IMPLEMENTED",
            message: `aggregateEntityTypes is not currently supported`,
          },
        ],
      };
    }, []);

  const getEntityType: EmbedderGraphMessageCallbacks["getEntityType"] =
    useCallback(async ({ data }) => {
      return {
        errors: [
          {
            code: "NOT_IMPLEMENTED",
            message: `Retrieving Entity Types is not currently supported`,
          },
        ],
      };

      /** @todo - interim solution: retrieve entity type from URL */
      /** @todo - implement entity type resolution */
      // eslint-disable-next-line no-unreachable -- currently unimplemented
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
    }, []);

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
      return {
        errors: [
          {
            code: "NOT_IMPLEMENTED",
            message: `Uploading files is not currently supported`,
          },
        ],
      };

      /** @todo - create the file entity-type and re-enable file uploading */
      // eslint-disable-next-line no-unreachable -- currently unimplemented
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
      // const { file, url, mediaType } = data;
      // if (!file && !url?.trim()) {
      //   throw new Error(
      //     `Please enter a valid ${mediaType} URL or select a file below`,
      //   );
      // }
      //
      // if (url?.trim()) {
      //   const resp = await createEntity({
      //     data: {
      //       entityTypeId: "file1",
      //       properties: {
      //         url,
      //         mediaType,
      //       },
      //     },
      //   });
      //   if (resp.errors || !resp.data) {
      //     return {
      //       errors: resp.errors ?? [
      //         {
      //           code: "INVALID_INPUT",
      //           message: "Could not create File entity ",
      //         },
      //       ],
      //     };
      //   }
      //   const returnData: UploadFileReturn = {
      //     entityId: resp.data.entityId,
      //     mediaType,
      //     url,
      //   };
      //   return Promise.resolve({ data: returnData });
      // } else if (file) {
      //   const result = await new Promise<FileReader["result"] | null>(
      //     (resolve, reject) => {
      //       const reader = new FileReader();
      //
      //       reader.onload = (event) => {
      //         resolve(event.target?.result ?? null);
      //       };
      //
      //       reader.onerror = (event) => {
      //         reject(event);
      //       };
      //
      //       reader.readAsDataURL(file);
      //     },
      //   );
      //
      //   if (result) {
      //     const resp = await createEntity({
      //       data: {
      //         entityTypeId: "file1",
      //         properties: {
      //           url: result.toString(),
      //           mediaType,
      //         },
      //       },
      //     });
      //     if (resp.errors || !resp.data) {
      //       return {
      //         errors: resp.errors ?? [
      //           {
      //             code: "INVALID_INPUT",
      //             message: "Could not create File entity ",
      //           },
      //         ],
      //       };
      //     }
      //     const returnData: UploadFileReturn = {
      //       entityId: resp.data.entityId,
      //       mediaType,
      //       url: result.toString(),
      //     };
      //     return Promise.resolve({ data: returnData });
      //   }
      //
      //   throw new Error("Couldn't read your file");
      // }
      // throw new Error("Unreachable.");
    },
    [readonly],
  );

  return {
    graph,
    graphServiceCallbacks: {
      aggregateEntities,
      getEntity,
      createEntity,
      deleteEntity,
      updateEntity,
      aggregateEntityTypes,
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
