import {
  Entity,
  FileEntity,
  FileEntityProperties,
  GraphEmbedderMessageCallbacks,
  isFileAtUrlData,
  isFileData,
  isHasLeftEntityEdge,
  isHasRightEntityEdge,
  KnowledgeGraphOutwardEdge,
  OntologyOutwardEdge,
  Subgraph,
} from "@blockprotocol/graph";
import { addEntitiesToSubgraphByMutation } from "@blockprotocol/graph/internal";
import { getEntityRevision } from "@blockprotocol/graph/stdlib";
import {
  GetEntityData as GetEntityDataTemporal,
  QueryEntitiesData as QueryEntitiesDataTemporal,
} from "@blockprotocol/graph/temporal";
import mime from "mime/lite";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

import { useDefaultState } from "../../use-default-state";
import { typedEntries } from "../../util";
import { getEntity as getEntityImpl } from "../hook-implementations/entity/get-entity";
import { queryEntities as queryEntitiesImpl } from "../hook-implementations/entity/query-entities";
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
      | "queryPropertyTypes"
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
  // const [linkedQueries, setLinkedQueries] = useDefaultState<
  //   MockDataStore["linkedQueryDefinitions"]
  // >(initialData.linkedQueryDefinitions);

  const queryEntities: GraphEmbedderMessageCallbacks["queryEntities"] =
    useCallback(
      async ({ data }) => {
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

        if ((data as QueryEntitiesDataTemporal).temporalAxes !== undefined) {
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

        return { data: queryEntitiesImpl<false>(data, graph) };
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
            },
            properties,
            linkData,
          };

          resolve({ data: newEntity });

          setGraph((currentGraph) => {
            const newSubgraph = JSON.parse(
              JSON.stringify(currentGraph),
            ) as Subgraph;

            addEntitiesToSubgraphByMutation(newSubgraph, [newEntity]);
            return newSubgraph;
          });
        });
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
          const { entityId } = data;
          setGraph((currentGraph) => {
            const currentEntity = getEntityRevision(currentGraph, entityId);

            if (!currentEntity) {
              resolve({
                errors: [
                  {
                    code: "NOT_FOUND",
                    message: `Could not find entity with ID: ${entityId}`,
                  },
                ],
              });
            }

            const newGraph = JSON.parse(
              JSON.stringify(currentGraph),
            ) as Subgraph;

            const toRemove = [entityId];

            const removeEntityAndLinks = (entityIdToRemove: string) => {
              delete newGraph.vertices[entityIdToRemove];
              delete newGraph.edges[entityIdToRemove];

              for (const [baseId, outwardEdgeObject] of typedEntries(
                newGraph.edges,
              )) {
                for (const [at, outwardEdges] of typedEntries(
                  outwardEdgeObject,
                )) {
                  const filteredEdges = (
                    outwardEdges as (typeof outwardEdges)[number][]
                  ).filter((outwardEdge) => {
                    // cascading delete link entities if their endpoints are deleted
                    if (
                      isHasLeftEntityEdge(outwardEdge) ||
                      isHasRightEntityEdge(outwardEdge)
                    ) {
                      if (
                        typeof outwardEdge.rightEndpoint === "string" &&
                        outwardEdge.rightEndpoint === entityIdToRemove &&
                        !toRemove.includes(baseId)
                      ) {
                        // `baseId` is a link entity, and either its left or right entity has been deleted, so we must
                        // also delete the link
                        toRemove.push(baseId);
                      }
                    }

                    // `baseId` had an edge to a deleted entity, so we remove the edge
                    return !(
                      typeof outwardEdge.rightEndpoint === "string" &&
                      outwardEdge.rightEndpoint === entityIdToRemove
                    );
                  });

                  if (filteredEdges.length > 0) {
                    newGraph.edges[baseId]![at] = filteredEdges as
                      | OntologyOutwardEdge[]
                      | KnowledgeGraphOutwardEdge[];
                  } else {
                    delete newGraph.edges[baseId]![at];

                    if (Object.entries(newGraph.edges[baseId]!).length === 0) {
                      delete newGraph.edges[baseId];
                    }
                  }
                }
              }
            };

            while (toRemove.length > 0) {
              const entityIdToRemove = toRemove.pop()!;
              removeEntityAndLinks(entityIdToRemove);
            }

            resolve({
              data: true,
            });

            return newGraph;
          });
        });
      },
      [setGraph, readonly],
    );

  const queryEntityTypes: GraphEmbedderMessageCallbacks["queryEntityTypes"] =
    useCallback(async ({ data: _ }) => {
      return {
        errors: [
          {
            code: "NOT_IMPLEMENTED",
            message: `queryEntityTypes is not currently supported`,
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

  /** @todo - Reimplement linkedQueries */
  // const createLinkedQuery: GraphEmbedderMessageCallbacks["createLinkedQuery"] =
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
  //     [setLinkedQueries, readonly],
  //   );
  //
  // const getLinkedQuery: GraphEmbedderMessageCallbacks["getLinkedQuery"] =
  //   useCallback(
  //     async ({ data }) => {
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
  //     [entities, linkedQueries],
  //   );
  //
  // const updateLinkedQuery: GraphEmbedderMessageCallbacks["updateLinkedQuery"] =
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
  //     [setLinkedQueries, readonly],
  //   );
  //
  // const deleteLinkedQuery: GraphEmbedderMessageCallbacks["deleteLinkedQuery"] =
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
  //     [setLinkedQueries, readonly],
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
      queryEntities,
      getEntity,
      createEntity,
      deleteEntity,
      updateEntity,
      queryEntityTypes,
      getEntityType,
      // getLinkedQuery,
      // createLinkedQuery,
      // deleteLinkedQuery,
      // updateLinkedQuery,
      uploadFile,
    },
    // linkedQueryDefinitions: linkedQueries,
  };
};
