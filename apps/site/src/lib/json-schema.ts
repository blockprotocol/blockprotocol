import { JsonObject } from "@blockprotocol/core";
import { EntityType as BlockProtocolEntityType } from "@blockprotocol/graph";
import { VersionedUri } from "@blockprotocol/type-system/slim";
import Ajv2019 from "ajv/dist/2019";

import { EntityType } from "./api/model/entity-type.model";

/**
 * When compiling a schema AJV tries to resolve $refs to other schemas.
 * For now we can just give it empty schemas as the resolution for those $refs.
 * @todo check that $refs point to URIs which return at least valid JSON.
 *    We might not want to check each is a valid schema as they might link on to many more.
 *    For schemas stored in our db, we know they're valid (since each is checked on insert).
 */
const loadEmptyExternalSchema = async (_uri: string) => {
  return {};
};

const ajv = new Ajv2019({
  addUsedSchema: false, // stop AJV trying to add compiled schemas to the instance
  loadSchema: loadEmptyExternalSchema,
});

const jsonSchemaVersion = "https://json-schema.org/draft/2019-09/schema";

/**
 * Generates a URI for a schema in blockprotocol.org, to use as its $id
 * */
const generateSchema$id = (slug: string): VersionedUri =>
  `${EntityType.DEFAULT_$ID_ORIGIN}/types/entity-type/${slug}/v/1`;

/**
 * Create a JSON schema
 * @param params.author the namespace/username the schema belongs to
 * @param params.entityTypeId a globally unique id for this entity type
 * @param params.maybeSchema schema definition fields (in either a JSON string or JS object)
 *    (e.g. 'title', 'properties', 'description')
 */
export const validateAndCompleteJsonSchema = async (params: {
  entityTypeId: string;
  maybeSchema: unknown;
}): Promise<BlockProtocolEntityType> => {
  const { entityTypeId, maybeSchema } = params;

  if (
    (typeof maybeSchema !== "string" && typeof maybeSchema !== "object") ||
    maybeSchema == null
  ) {
    throw new Error("Schema must be either a JSON string or parsed object.");
  }

  let parsedSchema: JsonObject;
  try {
    parsedSchema =
      typeof maybeSchema === "string"
        ? JSON.parse(maybeSchema)
        : JSON.parse(JSON.stringify(maybeSchema));
  } catch (err) {
    throw new Error(
      `Could not parse schema: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  const { title } = parsedSchema;

  if (!title || typeof title !== "string") {
    throw new Error("Schema must have a 'title' property, a non-empty string.");
  }

  const schema = {
    ...parsedSchema,
    $schema: jsonSchemaVersion, // @todo-0.3 this should be our entity type meta-schema
    $id: generateSchema$id(entityTypeId),
    additionalProperties: false,
    kind: "entityType",
    properties:
      // @todo-0.3 fix this
      (parsedSchema.properties as any as BlockProtocolEntityType["properties"]) ??
      {},
    title: parsedSchema.title as string,
    type: "object",
    entityTypeId,
  } as const;

  try {
    await ajv.compileAsync(schema);
  } catch (err) {
    throw new Error(
      `Could not compile schema: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    );
  }

  return schema;
};
