import {
  EntityRootType,
  GraphEmbedderMessageCallbacks,
  RemoteFileEntity,
  Subgraph,
  VersionedUrl,
} from "@blockprotocol/graph";
import { buildSubgraph } from "@blockprotocol/graph/stdlib";
import { ServiceEmbedderMessageCallbacks } from "@blockprotocol/service";
import { useBlockProps } from "@wordpress/block-editor";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import {
  blockSubgraphResolveDepths,
  createEntity as apiCreateEntity,
  dbEntityToEntity,
  deleteEntity as apiDeleteEntity,
  getEntitySubgraph,
  queryEntities,
  updateEntity as apiUpdateEntity,
  uploadFile as apiUploadFile,
} from "../shared/api";
import { BlockLoader } from "../shared/block-loader";
import { CustomBlockControls } from "./edit/block-controls";
import { LoadingImage } from "./edit/loading-image";
import { constructServiceModuleCallbacks } from "./edit/service-callbacks";
import { Toast, ToastProps } from "./edit/toast";
import { CloseButton } from "./edit/toast/close-button";
import { CrossIcon } from "./edit/toast/cross-icon";

type BlockProtocolBlockAttributes = {
  author: string;
  blockName: string;
  entityId: string;
  entityTypeId: string;
  preview: boolean;
  protocol: string;
  sourceUrl: string;
};

type EditProps = {
  attributes: BlockProtocolBlockAttributes;
  setAttributes: (attributes: Partial<BlockProtocolBlockAttributes>) => void;
};

/**
 * The admin view of the block – the block is in editable mode, with callbacks to create, update, and delete entities
 */
export const Edit = ({
  attributes: { blockName, entityId, entityTypeId, sourceUrl },
  setAttributes,
}: EditProps) => {
  const blockProps = useBlockProps();

  const [entitySubgraph, setEntitySubgraph] =
    useState<Subgraph<EntityRootType> | null>(null);

  const displayToast = useCallback(
    (toastProps: ToastProps, options?: Parameters<typeof toast>[1]) => {
      toast(<Toast {...toastProps} type="error" />, {
        autoClose: false,
        closeButton: <CloseButton />,
        closeOnClick: false,
        draggable: true,
        draggablePercent: 30,
        containerId: entityId,
        icon: <CrossIcon />,
        position: toast.POSITION.BOTTOM_LEFT,
        type: toast.TYPE.ERROR,
        ...options,
      });
    },
    [entityId],
  );

  // this represents the latest versions of blocks from the Block Protocol API
  // the page may contain older versions of blocks, so do not rely on all blocks being here
  const blocks = window.block_protocol_data?.blocks;

  const selectedBlock = blocks?.find((block) => block.source === sourceUrl);

  const setEntityId = useCallback(
    (newEntityId: string) => setAttributes({ entityId: newEntityId }),
    [setAttributes],
  );

  const creating = useRef(false);

  useEffect(() => {
    if (creating.current) {
      return;
    }

    if (!entityId) {
      creating.current = true;
      void apiCreateEntity({
        entityTypeId,
        properties: {},
        blockMetadata: {
          sourceUrl,
          version: selectedBlock?.version ?? "unknown",
        },
      })
        .then(({ entity }) => {
          if (!entity) {
            throw new Error("no entity returned from createEntity");
          }
          const { entity_id } = entity;
          const subgraph = buildSubgraph(
            {
              entities: [dbEntityToEntity(entity)],
              dataTypes: [],
              entityTypes: [],
              propertyTypes: [],
            },
            [
              {
                entityId: entity.entity_id,
                editionId: new Date(entity.updated_at).toISOString(),
              },
            ],
            blockSubgraphResolveDepths,
          );
          setEntitySubgraph(subgraph);
          setEntityId(entity_id);
          creating.current = false;
        })
        .catch((error) => {
          displayToast({
            content: (
              <div>
                Could not create Block Protocol entity
                {error?.message ? `: ${error.message}` : "."}{" "}
                <a
                  href="https://blockprotocol.org/contact"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Help
                </a>
              </div>
            ),
            type: "error",
          });
        });
    } else if (
      !entitySubgraph ||
      entitySubgraph.roots[0]?.baseId !== entityId
    ) {
      void getEntitySubgraph({
        data: {
          entityId,
          graphResolveDepths: blockSubgraphResolveDepths,
        },
      }).then(({ data }) => {
        if (!data) {
          displayToast({
            content: (
              <div>
                Could not find Block Protocol entity with id starting{" "}
                <strong>{entityId.slice(0, 8)}</strong>.{" "}
                <a
                  href="https://blockprotocol.org/contact"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Help
                </a>
              </div>
            ),
            type: "error",
          });
          return;
        }
        setEntitySubgraph(data);
      });
    }
  }, [
    displayToast,
    entitySubgraph,
    entityId,
    entityTypeId,
    sourceUrl,
    selectedBlock?.version,
    setEntityId,
  ]);

  const refetchSubgraph = useCallback(async () => {
    if (!entityId) {
      return;
    }

    const { data: subgraph } = await getEntitySubgraph({
      data: { entityId, graphResolveDepths: blockSubgraphResolveDepths },
    });

    if (!subgraph) {
      displayToast({
        content: (
          <div>
            Could not find Block Protocol entity with id starting{" "}
            <strong>{entityId.slice(0, 8)}</strong>.{" "}
            <a
              href="https://blockprotocol.org/contact"
              target="_blank"
              rel="noreferrer"
            >
              Get Help
            </a>
          </div>
        ),
        type: "error",
      });
      return;
    }

    setEntitySubgraph(subgraph);
  }, [displayToast, entityId]);

  const serviceCallbacks = useMemo<ServiceEmbedderMessageCallbacks>(
    () =>
      constructServiceModuleCallbacks((toastProps) =>
        displayToast(toastProps, { toastId: "billing" }),
      ),
    [displayToast],
  );

  const graphCallbacks = useMemo<
    Required<
      Pick<
        GraphEmbedderMessageCallbacks,
        | "createEntity"
        | "deleteEntity"
        | "getEntity"
        | "updateEntity"
        | "uploadFile"
        | "queryEntities"
      >
    >
  >(
    () => ({
      getEntity: getEntitySubgraph,
      createEntity: async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                message: "No data provided in createEntity request",
                code: "INVALID_INPUT",
              },
            ],
          };
        }

        const creationData = data;

        const { entity: createdEntity } = await apiCreateEntity(creationData);

        void refetchSubgraph(); // @todo should we await this – slows down response but ensures no delay between entity update + subgraph update

        return { data: dbEntityToEntity(createdEntity) };
      },
      updateEntity: async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                message: "No data provided in updateEntity request",
                code: "INVALID_INPUT",
              },
            ],
          };
        }

        const {
          entityId: entityIdToUpdate,
          properties,
          leftToRightOrder,
          rightToLeftOrder,
        } = data;

        try {
          const { entity: updatedDbEntity } = await apiUpdateEntity(
            entityIdToUpdate,
            {
              properties,
              leftToRightOrder,
              rightToLeftOrder,
            },
          );

          void refetchSubgraph(); // @todo should we await this – slows down response but ensures no delay between entity update + subgraph update

          return {
            data: dbEntityToEntity(updatedDbEntity),
          };
        } catch (err) {
          return {
            errors: [
              {
                message: `Error when processing update of entity ${entityIdToUpdate}: ${err}`,
                code: "INTERNAL_ERROR",
              },
            ],
          };
        }
      },
      deleteEntity: async ({ data }) => {
        if (!data) {
          return {
            errors: [
              {
                message: "No data provided in deleteEntity request",
                code: "INVALID_INPUT",
              },
            ],
          };
        }

        const { entityId: entityIdToDelete } = data;

        try {
          await apiDeleteEntity(entityIdToDelete);
        } catch (err) {
          return {
            errors: [
              {
                message: `Error when processing deletion of entity ${entityIdToDelete}: ${err}`,
                code: "INTERNAL_ERROR",
              },
            ],
          };
        }

        void refetchSubgraph(); // @todo should we await this – slows down response but ensures no delay between entity update + subgraph update

        return { data: true };
      },
      uploadFile: async ({ data }) => {
        if (!data) {
          throw new Error("No data provided in uploadFile request");
        }

        try {
          const { entity } = await apiUploadFile(data);
          return {
            data: dbEntityToEntity(entity) as RemoteFileEntity,
          };
        } catch (err) {
          return {
            errors: [
              {
                message: `Error when processing file upload: ${err}`,
                code: "INTERNAL_ERROR",
              },
            ],
          };
        }
      },

      queryEntities: async ({ data }) => {
        if (!data) {
          throw new Error("No data provided in queryEntities request");
        }

        try {
          const { entities } = await queryEntities(data);

          const subgraph = buildSubgraph(
            {
              entities: entities.map(dbEntityToEntity),
              dataTypes: [],
              entityTypes: [],
              propertyTypes: [],
            },
            entities.map((entity) => ({
              entityId: entity.entity_id,
              editionId: new Date(entity.updated_at).toISOString(),
            })),
            blockSubgraphResolveDepths,
          );

          return {
            data: {
              results: subgraph,
              operation: data.operation,
            },
          };
        } catch (err) {
          return {
            errors: [
              {
                message: `Error when querying entities: ${err}`,
                code: "INTERNAL_ERROR",
              },
            ],
          };
        }
      },
    }),
    [refetchSubgraph],
  );

  if (!entitySubgraph) {
    return (
      <div style={{ marginTop: 10 }}>
        <ToastContainer enableMultiContainer containerId={entityId} />
        <LoadingImage height="8rem" />
      </div>
    );
  }

  return (
    <div {...blockProps} style={{ marginBottom: 30 }}>
      <ToastContainer enableMultiContainer containerId={entityId} />
      <CustomBlockControls
        entityId={entityId}
        entityTypeId={entityTypeId as VersionedUrl} // @todo fix this in @blockprotocol/graph
        setEntityId={setEntityId}
        entitySubgraph={entitySubgraph}
        updateEntity={graphCallbacks.updateEntity}
      />
      <BlockLoader
        blockName={blockName}
        callbacks={{ graph: graphCallbacks, service: serviceCallbacks }}
        entitySubgraph={entitySubgraph}
        LoadingImage={LoadingImage}
        readonly={false}
        sourceUrl={sourceUrl}
      />
    </div>
  );
};
