import {
  Entity,
  GraphEmbedderMessageCallbacks,
  GraphResolveDepths,
  isFileAtUrlData,
  isFileData,
  QueryEntitiesData,
  UploadFileData,
  VersionedUrl,
} from "@blockprotocol/graph";
import { buildSubgraph } from "@blockprotocol/graph/stdlib";
import apiFetch from "@wordpress/api-fetch";

const defaultOntologyResolveDepths: Omit<
  GraphResolveDepths,
  "hasLeftEntity" | "hasRightEntity"
> = {
  constrainsLinksOn: { outgoing: 0 },
  constrainsLinkDestinationsOn: { outgoing: 0 },
  constrainsPropertiesOn: { outgoing: 0 },
  constrainsValuesOn: { outgoing: 0 },
  inheritsFrom: { outgoing: 0 },
  isOfType: { outgoing: 0 },
};

const defaultEntityResolveDepths: Pick<
  GraphResolveDepths,
  "hasLeftEntity" | "hasRightEntity"
> = {
  hasLeftEntity: { incoming: 1, outgoing: 1 },
  hasRightEntity: { incoming: 1, outgoing: 1 },
};

export const blockSubgraphResolveDepths = {
  ...defaultOntologyResolveDepths,
  ...defaultEntityResolveDepths,
};

export type DbEntity = {
  entity_id: string;
  entity_type_id: VersionedUrl;
  properties: string;
  created_at: string;
  updated_at: string;

  // these are ints in the db but the default driver returns them as strings
  created_by: string | number;
  updated_by: string | number;
} & (
  | {}
  | {
      left_entity_id: string;
      right_entity_id: string;

      // these are ints in the db but the default driver returns them as strings
      left_to_right_order?: string | number;
      right_to_left_order?: string | number;
    }
);

export type DbEntities = DbEntity[];

/**
 * We don't know what db driver is being used – it might be the default one which returns ints as strings.
 * We could do this parsing on the server, but we need to loop through entities for conversion here anyway.
 *
 * @param  value
 */
const parseIntIfDefined = (value: string | undefined | number) =>
  typeof value === "string" ? parseInt(value, 10) : value;

export const dbEntityToEntity = (dbEntity: DbEntity): Entity => {
  return {
    metadata: {
      recordId: {
        entityId: dbEntity.entity_id,
        editionId: new Date(dbEntity.updated_at).toISOString(),
      },
      entityTypeId: dbEntity.entity_type_id,
    },
    properties: JSON.parse(dbEntity.properties),
    linkData:
      "left_entity_id" in dbEntity
        ? {
            leftEntityId: dbEntity.left_entity_id,
            rightEntityId: dbEntity.right_entity_id,
            leftToRightOrder: parseIntIfDefined(dbEntity.left_to_right_order),
            rightToLeftOrder: parseIntIfDefined(dbEntity.right_to_left_order),
          }
        : undefined,
  };
};

export const queryEntities = (
  query: QueryEntitiesData,
): Promise<{ entities: DbEntities }> => {
  return apiFetch({
    path: `/blockprotocol/entities/query`,
    body: JSON.stringify(query),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export const getEntity = async (
  entityId: string,
  depths: Pick<GraphResolveDepths, "hasLeftEntity" | "hasRightEntity"> = {
    hasLeftEntity: { incoming: 0, outgoing: 0 },
    hasRightEntity: { incoming: 0, outgoing: 0 },
  },
): Promise<{
  entities?: DbEntities;
  depths: Required<GraphResolveDepths>;
}> => {
  const {
    hasLeftEntity: { incoming: has_left_incoming, outgoing: has_left_outgoing },
    hasRightEntity: {
      incoming: has_right_incoming,
      outgoing: has_right_outgoing,
    },
  } = depths;
  return apiFetch({
    path: `/blockprotocol/entities/${entityId}?has_left_incoming=${has_left_incoming}&has_left_outgoing=${has_left_outgoing}&has_right_incoming=${has_right_incoming}&has_right_outgoing=${has_right_outgoing}`,
  });
};

export const getEntitySubgraph: GraphEmbedderMessageCallbacks["getEntity"] =
  async ({ data }) => {
    if (!data) {
      return {
        errors: [
          {
            message: "No data provided in getEntity request",
            code: "INVALID_INPUT",
          },
        ],
      };
    }

    const { entityId, graphResolveDepths } = data;

    try {
      const { entities: dbEntities, depths } = await getEntity(entityId, {
        ...defaultEntityResolveDepths,
        ...graphResolveDepths,
      });

      if (!dbEntities) {
        throw new Error("could not find entity in database");
      }

      const root = dbEntities.find((entity) => entity.entity_id === entityId);
      if (!root) {
        throw new Error("root not found in subgraph");
      }

      const rootEntityRecordId = dbEntityToEntity(root).metadata.recordId;

      return {
        data: buildSubgraph(
          {
            entities: dbEntities.map(dbEntityToEntity),
            dataTypes: [],
            entityTypes: [],
            propertyTypes: [],
          },
          [rootEntityRecordId],
          depths,
        ),
      };
    } catch (err) {
      return {
        errors: [
          {
            message: `Error when fetching Block Protocol entity ${entityId}: ${
              (err as Error).message
            }`,
            code: "INTERNAL_ERROR",
          },
        ],
      };
    }
  };

export const updateEntity = (
  entityId: string,
  updateData: {
    properties: Record<string, unknown>;
    leftToRightOrder?: number;
    rightToLeftOrder?: number;
  },
): Promise<{ entity: DbEntity }> => {
  return apiFetch({
    path: `/blockprotocol/entities/${entityId}`,
    body: JSON.stringify({
      properties: updateData.properties,
      left_to_right_order: updateData.leftToRightOrder,
      right_to_left_order: updateData.rightToLeftOrder,
    }),
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
};

export const createEntity = (
  creationData: {
    entityTypeId: string;
    properties: Record<string, unknown>;
    blockMetadata?: { sourceUrl: string; version: string };
  } & (
    | {}
    | {
        linkData: {
          leftEntityId: string;
          rightEntityId: string;
          leftToRightOrder?: number;
          rightToLeftOrder?: number;
        };
      }
  ),
): Promise<{ entity: DbEntity }> => {
  return apiFetch({
    path: `/blockprotocol/entities`,
    body: JSON.stringify({
      entity_type_id: creationData.entityTypeId,
      properties: creationData.properties,
      block_metadata: creationData.blockMetadata
        ? {
            source_url: creationData.blockMetadata.sourceUrl,
            version: creationData.blockMetadata.version,
          }
        : undefined,
      ...("linkData" in creationData && creationData.linkData.leftEntityId
        ? {
            left_entity_id: creationData.linkData.leftEntityId,
            right_entity_id: creationData.linkData.rightEntityId,
            left_to_right_order: creationData.linkData.leftToRightOrder,
            right_to_left_order: creationData.linkData.rightToLeftOrder,
          }
        : {}),
    }),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteEntity = (entityId: string): Promise<boolean> => {
  return apiFetch({
    path: `/blockprotocol/entities/${entityId}`,
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

export const uploadFile = (
  fileData: UploadFileData,
): Promise<{ entity: DbEntity }> => {
  const file = isFileData(fileData) ? fileData.file : undefined;
  const url = isFileAtUrlData(fileData) ? fileData.url : undefined;

  if ((!file && !url) || (file && url)) {
    throw new Error("Either file or url must be provided");
  }

  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  } else if (url) {
    formData.append("url", url);
  }
  if (fileData.description) {
    formData.append("description", fileData.description);
  }

  return apiFetch({
    path: "/blockprotocol/file",
    method: "POST",
    body: formData,
  });
};
