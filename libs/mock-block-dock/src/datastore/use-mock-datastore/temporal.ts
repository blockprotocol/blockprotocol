import {
  GetEntityData as GetEntityDataTemporal,
  QueryEntitiesData as QueryEntitiesDataTemporal,
} from "@blockprotocol/graph/dist/cjs/temporal/main";
import {
  addEntityVerticesToSubgraphByMutation,
  inferEntityEdgesInSubgraphByMutation,
} from "@blockprotocol/graph/internal";
import {
  Entity,
  GraphEmbedderMessageCallbacks,
  isFileAtUrlData,
  isFileData,
  RemoteFileEntity,
  RemoteFileEntityProperties,
  Subgraph,
} from "@blockprotocol/graph/temporal";
import { getEntityRevision } from "@blockprotocol/graph/temporal/stdlib";
import mime from "mime/lite";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultState } from "../../use-default-state";
import { mustBeDefined } from "../../util";
import { getDefaultEntityVersionInterval } from "../get-default-entity-version-interval";
import { getDefaultTemporalAxes } from "../get-default-temporal-axes";
import { getEntity as getEntityImpl } from "../hook-implementations/entity/get-entity";
import { queryEntities as queryEntitiesImpl } from "../hook-implementations/entity/query-entities";
import { MockData } from "../mock-data";
import { useMockDataToSubgraph } from "../use-mock-data-to-subgraph";
import { waitForRandomLatency } from "./shared";

export type MockDatastore = {
  graph: Subgraph;
  graphModuleCallbacks: Required<
    Omit<
      GraphEmbedderMessageCallbacks,
      | "createEntityType"
      | "updateEntityType"
      | "deleteEntityType"
      | "createPropertyType"
      | "updatePropertyType"
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
  initialData: MockData<true>,
  readonly?: boolean,
  simulateDatastoreLatency?: { min: number; max: number },
): MockDatastore => {
  const mockDataSubgraph = useMockDataToSubgraph(initialData);
  const [graph, setGraph] = useDefaultState(mockDataSubgraph);
  const waitForLatency = useCallback(
    () => waitForRandomLatency(simulateDatastoreLatency),
    [simulateDatastoreLatency],
  );

  // const [linkedQueries, setLinkedQueries] = useDefaultState<
  //   MockDataStore["linkedQueryDefinitions"]
  // >(initialData.linkedQueryDefinitions);

  const queryEntities: GraphEmbedderMessageCallbacks["queryEntities"] =
    useCallback(
      async ({ data }) => {
        await waitForLatency();

        if (!data) {
          return {
            errors: [
              {
                code: "INVALID_INPUT",
                message: "queryEntities requires 'data' input",
              },
            ],
          };
        }

        if ((data as QueryEntitiesDataTemporal).temporalAxes === undefined) {
          return {
            data: queryEntitiesImpl<true>(
              {
                ...data,
                temporalAxes: getDefaultTemporalAxes(),
              },
              graph,
            ),
          };
        }

        return {
          data: queryEntitiesImpl<true>(
            data as QueryEntitiesDataTemporal,
            graph,
          ),
        };
      },
      [graph, waitForLatency],
    );

  const createEntity: GraphEmbedderMessageCallbacks["createEntity"] =
    useCallback(
      async ({ data }) => {
        await waitForLatency();

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

        return new Promise((resolve) => {
          const entityId = uuid();
          const { entityTypeId, properties, linkData } = data;

          const newEntity: Entity = {
            metadata: {
              recordId: {
                entityId,
                editionId: new Date().toISOString(),
              },
              entityTypeId,
              temporalVersioning: getDefaultEntityVersionInterval(),
            },
            properties,
            linkData,
          };
          resolve({ data: newEntity });

          setGraph((currentGraph) => {
            const newSubgraph = JSON.parse(
              JSON.stringify(currentGraph),
            ) as Subgraph;

            const entityVertexIds = addEntityVerticesToSubgraphByMutation(
              newSubgraph,
              [newEntity],
            );
            inferEntityEdgesInSubgraphByMutation(newSubgraph, entityVertexIds);

            return newSubgraph;
          });
        });
      },
      [readonly, setGraph, waitForLatency],
    );

  const getEntity: GraphEmbedderMessageCallbacks["getEntity"] = useCallback(
    async ({ data }) => {
      await waitForLatency();

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

      if ((data as GetEntityDataTemporal).temporalAxes === undefined) {
        return {
          data: getEntityImpl<true>(
            {
              ...data,
              temporalAxes: getDefaultTemporalAxes(),
            },
            graph,
          ),
        };
      }

      const entitySubgraph = getEntityImpl<true>(data, graph);

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
    [graph, waitForLatency],
  );

  const updateEntity: GraphEmbedderMessageCallbacks["updateEntity"] =
    useCallback(
      async ({ data }) => {
        await waitForLatency();

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

            const currentTime = new Date().toISOString();

            // Update the old entity revision's end times
            const updatedOldRevisionEndBound = {
              kind: "exclusive",
              limit: currentTime,
            } as const;

            const newCurrentEntity = mustBeDefined(
              newSubgraph.vertices[currentEntity.metadata.recordId.entityId]?.[
                currentEntity.metadata.temporalVersioning[
                  currentGraph.temporalAxes.resolved.variable.axis
                ].start.limit
              ]?.inner,
            ) as Entity;

            newCurrentEntity.metadata.temporalVersioning.decisionTime.end =
              updatedOldRevisionEndBound;
            newCurrentEntity.metadata.temporalVersioning.transactionTime.end =
              updatedOldRevisionEndBound;

            // We need a version that starts from the current time and is unbounded on the end bound
            const updatedEntityRevisionTemporalInterval = {
              start: {
                kind: "inclusive",
                limit: currentTime,
              },
              end: {
                kind: "unbounded",
              },
            } as const;

            const updatedEntity: Entity = {
              metadata: {
                recordId: {
                  entityId,
                  editionId: currentTime,
                },
                entityTypeId,
                temporalVersioning: {
                  transactionTime: updatedEntityRevisionTemporalInterval,
                  decisionTime: updatedEntityRevisionTemporalInterval,
                },
              },
              properties,
              linkData,
            };

            resolve({ data: updatedEntity });

            /**
             * @todo this update logic may be incorrect, we have to do some
             * testing to ensure it behaves as expected */
            const entityVertexIds = addEntityVerticesToSubgraphByMutation(
              newSubgraph,
              [updatedEntity],
            );
            inferEntityEdgesInSubgraphByMutation(newSubgraph, entityVertexIds);

            return newSubgraph;
          });
        });
      },
      [readonly, setGraph, waitForLatency],
    );

  const deleteEntity: GraphEmbedderMessageCallbacks["deleteEntity"] =
    useCallback(
      async ({ data }) => {
        await waitForLatency();

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `Entity deletion is not currently supported in a datastore with temporal versioning`,
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
      [setGraph, readonly, waitForLatency],
    );

  const queryEntityTypes: GraphEmbedderMessageCallbacks["queryEntityTypes"] =
    useCallback(
      async ({ data: _ }) => {
        await waitForLatency();

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `queryEntityTypes is not currently supported`,
            },
          ],
        };
      },
      [waitForLatency],
    );

  const getEntityType: GraphEmbedderMessageCallbacks["getEntityType"] =
    useCallback(
      async ({ data }) => {
        await waitForLatency();

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
      },
      [waitForLatency],
    );

  const getPropertyType: GraphEmbedderMessageCallbacks["getPropertyType"] =
    useCallback(
      async ({ data: _ }) => {
        await waitForLatency();

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `getPropertyType is not currently supported`,
            },
          ],
        };
      },
      [waitForLatency],
    );

  const queryPropertyTypes: GraphEmbedderMessageCallbacks["queryPropertyTypes"] =
    useCallback(
      async ({ data: _ }) => {
        await waitForLatency();

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `queryPropertyTypes is not currently supported`,
            },
          ],
        };
      },
      [waitForLatency],
    );

  const getDataType: GraphEmbedderMessageCallbacks["getDataType"] = useCallback(
    async ({ data: _ }) => {
      await waitForLatency();

      return {
        errors: [
          {
            code: "NOT_IMPLEMENTED",
            message: `getDataType is not currently supported`,
          },
        ],
      };
    },
    [waitForLatency],
  );

  const queryDataTypes: GraphEmbedderMessageCallbacks["queryDataTypes"] =
    useCallback(
      async ({ data: _ }) => {
        await waitForLatency();

        return {
          errors: [
            {
              code: "NOT_IMPLEMENTED",
              message: `queryDataTypes is not currently supported`,
            },
          ],
        };
      },
      [waitForLatency],
    );

  /** @todo - Reimplement linkedQueries */
  // const createLinkedQuery: GraphEmbedderMessageCallbacks["createLinkedQuery"] =
  //   useCallback(
  //     async ({ data }) => {
  //       await waitForLatency();
  //
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "createLinkedQuery requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       const newLinkedQuery = {
  //         linkedQueryId: uuid(),
  //         ...data,
  //       };
  //       setLinkedQueries((currentLinkedQueries) => [
  //         ...currentLinkedQueries,
  //         newLinkedQuery,
  //       ]);
  //       return { data: newLinkedQuery };
  //     },
  //     [setLinkedQueries, readonly, waitForLatency],
  //   );
  //
  // const getLinkedQuery: GraphEmbedderMessageCallbacks["getLinkedQuery"] =
  //   useCallback(
  //     async ({ data }) => {
  //       await waitForLatency();

  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "getLinkedQuery requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       const foundLinkedQuery = linkedQueries.find(
  //         (linkedQuery) =>
  //           linkedQuery.linkedQueryId === data.linkedQueryId,
  //       );
  //       if (!foundLinkedQuery) {
  //         return {
  //           errors: [
  //             {
  //               code: "NOT_FOUND",
  //               message: `Could not find linkedQuery with linkedQueryId '${data.linkedQueryId}'`,
  //             },
  //           ],
  //         };
  //       }
  //       return {
  //         data: {
  //           ...foundLinkedQuery,
  //           ...filterAndSortEntitiesOrTypes(entities, foundLinkedQuery),
  //         },
  //       };
  //     },
  //     [entities, linkedQueries, waitForLatency],
  //   );
  //
  // const updateLinkedQuery: GraphEmbedderMessageCallbacks["updateLinkedQuery"] =
  //   useCallback(
  //     async ({ data }) => {
  //       await waitForLatency();
  //
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "updateLinkedQuery requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       return new Promise((resolve) => {
  //         setLinkedQueries((currentLinkedQueries) => {
  //           if (
  //             !currentLinkedQueries.find(
  //               ({ linkedQueryId }) => linkedQueryId === data.linkedQueryId,
  //             )
  //           ) {
  //             resolve({
  //               errors: [
  //                 {
  //                   code: "NOT_FOUND",
  //                   message: `Could not find linked query with linkedQueryId '${data.linkedQueryId}'`,
  //                 },
  //               ],
  //             });
  //             return currentLinkedQueries;
  //           }
  //           return currentLinkedQueries.map((linkedQuery) => {
  //             if (linkedQuery.linkedQueryId === data.linkedQueryId) {
  //               const newLinkedQuery = {
  //                 ...linkedQuery,
  //                 operation: data.operation,
  //               };
  //               resolve({ data: newLinkedQuery });
  //               return newLinkedQuery;
  //             }
  //             return linkedQuery;
  //           });
  //         });
  //       });
  //     },
  //     [setLinkedQueries, readonly, waitForLatency],
  //   );
  //
  // const deleteLinkedQuery: GraphEmbedderMessageCallbacks["deleteLinkedQuery"] =
  //   useCallback(
  //     async ({ data }) => {
  //       await waitForLatency();
  //
  //       if (readonly) {
  //         return readonlyErrorReturn;
  //       }
  //
  //       if (!data) {
  //         return {
  //           errors: [
  //             {
  //               code: "INVALID_INPUT",
  //               message: "deleteLinkedQuery requires 'data' input",
  //             },
  //           ],
  //         };
  //       }
  //       return new Promise((resolve) => {
  //         setLinkedQueries((currentLinkedQueries) => {
  //           if (
  //             !currentLinkedQueries.find(
  //               ({ linkedQueryId }) => linkedQueryId === data.linkedQueryId,
  //             )
  //           ) {
  //             resolve({
  //               errors: [
  //                 {
  //                   code: "NOT_FOUND",
  //                   message: `Could not find link with linkedQueryId '${data.linkedQueryId}'`,
  //                 },
  //               ],
  //             });
  //             return currentLinkedQueries;
  //           }
  //           return currentLinkedQueries.filter((link) => {
  //             if (link.linkedQueryId === data.linkedQueryId) {
  //               resolve({ data: true });
  //               return false;
  //             }
  //             return true;
  //           });
  //         });
  //       });
  //     },
  //     [setLinkedQueries, readonly, waitForLatency],
  //   );

  const uploadFile: GraphEmbedderMessageCallbacks["uploadFile"] = useCallback(
    async ({ data }) => {
      await waitForLatency();

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

      const newEntityProperties: RemoteFileEntityProperties = {
        "https://blockprotocol.org/@blockprotocol/types/property-type/description/":
          description,
        "https://blockprotocol.org/@blockprotocol/types/property-type/file-name/":
          filename,
        "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/":
          mimeType,
        "https://blockprotocol.org/@blockprotocol/types/property-type/file-url/":
          resolvedUrl,
      };

      const { data: newEntity, errors } = await createEntity({
        data: {
          entityTypeId:
            "https://blockprotocol.org/@blockprotocol/types/entity-type/remote-file/v/2",
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
      return Promise.resolve({ data: newEntity as RemoteFileEntity });
    },
    [createEntity, readonly, waitForLatency],
  );

  return {
    graph,
    graphModuleCallbacks: {
      queryEntities,
      getEntity,
      createEntity,
      deleteEntity,
      updateEntity,
      queryEntityTypes,
      getEntityType,
      getPropertyType,
      queryPropertyTypes,
      getDataType,
      queryDataTypes,
      // getLinkedQuery,
      // createLinkedQuery,
      // deleteLinkedQuery,
      // updateLinkedQuery,
      uploadFile,
    },
    // linkedQueryDefinitions: linkedQueries,
  };
};
