import {
  Entity,
  FileEntity,
  FileEntityProperties,
  GraphEmbedderMessageCallbacks,
  isFileAtUrlData,
  isFileData,
  Subgraph,
} from "@blockprotocol/graph";
import { addEntitiesToSubgraphByMutation } from "@blockprotocol/graph/internal";
import { getEntityRevision } from "@blockprotocol/graph/stdlib";
import {
  AggregateEntitiesData as AggregateEntitiesDataTemporal,
  GetEntityData as GetEntityDataTemporal,
} from "@blockprotocol/graph/temporal";
import mime from "mime/lite";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultState } from "../../use-default-state";
import { aggregateEntities as aggregateEntitiesImpl } from "../hook-implementations/entity/aggregate-entities";
import { getEntity as getEntityImpl } from "../hook-implementations/entity/get-entity";
import { MockData } from "../mock-data";
import { useMockDataToSubgraph } from "../use-mock-data-to-subgraph";

export type MockDatastore = {
  graph: Subgraph;
  graphModuleCallbacks: Required<
    Omit<
      GraphEmbedderMessageCallbacks,
      | "createEntityType"
      | "updateEntityType"
      | "deleteEntityType"
      | "getPropertyType"
      | "createPropertyType"
      | "updatePropertyType"
      | "aggregatePropertyTypes"
    >
  >;
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
  initialData: MockData<false>,
  readonly?: boolean,
): MockDatastore => {
  const mockDataSubgraph = useMockDataToSubgraph(initialData);
  const [graph, setGraph] = useDefaultState(mockDataSubgraph);
  // const [linkedAggregations, setLinkedAggregations] = useDefaultState<
  //   MockDataStore["linkedAggregationDefinitions"]
  // >(initialData.linkedAggregationDefinitions);

  const aggregateEntities: GraphEmbedderMessageCallbacks["aggregateEntities"] =
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

        if (
          (data as AggregateEntitiesDataTemporal).temporalAxes !== undefined
        ) {
          return {
            errors: [
              {
                code: "NOT_IMPLEMENTED",
                message:
                  "The datastore has been initialized without support for temporal versioning, temporal queries from blocks are not supported",
              },
            ],
          };
        }

        return { data: aggregateEntitiesImpl<false>(data, graph) };
      },
      [graph],
    );

  const createEntity: GraphEmbedderMessageCallbacks["createEntity"] =
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
              entityId,
              editionId: new Date().toISOString(),
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

  const getEntity: GraphEmbedderMessageCallbacks["getEntity"] = useCallback(
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

      if ((data as GetEntityDataTemporal).temporalAxes !== undefined) {
        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message:
                "The datastore has been initialized without support for temporal versioning, temporal queries from blocks are not supported",
            },
          ],
        };
      }

      const entitySubgraph = getEntityImpl<false>(data, graph);

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

  const updateEntity: GraphEmbedderMessageCallbacks["updateEntity"] =
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

            const currentEntity = getEntityRevision(currentGraph, entityId);

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

            // This is fairly slow, we could leverage another deep-copy strategy such as lodash, or we could rework
            // the datastore so that the whole state isn't stored within a single object, thus allowing us to do
            // smaller update operations
            const newSubgraph = JSON.parse(
              JSON.stringify(currentGraph),
            ) as typeof currentGraph;

            const updatedEntity: Entity = {
              metadata: {
                recordId: {
                  entityId,
                  editionId: new Date().toISOString(),
                },
                entityTypeId,
              },
              properties,
              linkData,
            };

            newSubgraph.vertices[entityId]![
              Object.keys(newSubgraph.vertices[entityId]!).pop()!
            ]!.inner = updatedEntity;

            resolve({ data: updatedEntity });

            return newSubgraph;
          });
        });
      },
      [readonly, setGraph],
    );

  const deleteEntity: GraphEmbedderMessageCallbacks["deleteEntity"] =
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

  const aggregateEntityTypes: GraphEmbedderMessageCallbacks["aggregateEntityTypes"] =
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

  const getEntityType: GraphEmbedderMessageCallbacks["getEntityType"] =
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
  // const createLinkedAggregation: GraphEmbedderMessageCallbacks["createLinkedAggregation"] =
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
  // const getLinkedAggregation: GraphEmbedderMessageCallbacks["getLinkedAggregation"] =
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
  // const updateLinkedAggregation: GraphEmbedderMessageCallbacks["updateLinkedAggregation"] =
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
  // const deleteLinkedAggregation: GraphEmbedderMessageCallbacks["deleteLinkedAggregation"] =
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

  const uploadFile: GraphEmbedderMessageCallbacks["uploadFile"] = useCallback(
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
      const { description } = data;

      const file = isFileData(data) ? data.file : null;
      const url = isFileAtUrlData(data) ? data.url : null;
      if (!file && !url?.trim()) {
        throw new Error("Please provide either a valid URL or file");
      }

      let filename: string | undefined = data.name;
      let resolvedUrl: string = "https://unknown-url.example.com";
      if (url) {
        if (!filename) {
          filename = url.split("/").pop() ?? filename;
        }
        resolvedUrl = url;
      } else if (file) {
        if (!filename) {
          filename = file.name;
        }
        try {
          const readFileResult = await new Promise<FileReader["result"] | null>(
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
          if (!readFileResult) {
            throw new Error("No result from file reader");
          }
          resolvedUrl = readFileResult.toString();
        } catch (err) {
          throw new Error("Could not upload file");
        }
      }

      if (!filename) {
        throw new Error("Could not determine filename and no name provided");
      }

      const mimeType = mime.getType(filename) || "application/octet-stream";

      const newEntityProperties: FileEntityProperties = {
        "https://blockprotocol.org/@blockprotocol/types/property-type/description/":
          description,
        "https://blockprotocol.org/@blockprotocol/types/property-type/filename/":
          filename,
        "https://blockprotocol.org/@blockprotocol/types/property-type/url/":
          resolvedUrl,
        "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/":
          mimeType,
      };

      const { data: newEntity, errors } = await createEntity({
        data: {
          entityTypeId:
            "https://blockprotocol.org/@blockprotocol/types/entity-type/file/v/1",
          properties: newEntityProperties,
        },
      });

      if (errors || !newEntity) {
        return {
          errors: errors ?? [
            {
              code: "INVALID_INPUT",
              message: "Could not create File entity ",
            },
          ],
        };
      }
      return Promise.resolve({ data: newEntity as FileEntity });
    },
    [createEntity, readonly],
  );

  return {
    graph,
    graphModuleCallbacks: {
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
