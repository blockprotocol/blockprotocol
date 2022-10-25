import { JsonObject } from "@blockprotocol/core";
import { EntityType as BlockProtocolEntityType } from "@blockprotocol/graph";
import Ajv2019 from "ajv/dist/2019.js";
import { Schema } from "jsonschema";

import { EntityType } from "./api/model/entity-type.model.js";

// @todo patch ajv schema type and remove additional jsonschema dep
export type JsonSchema = Schema & {
  $defs?: Record<string, JsonSchema>;
  /** @see https://www.w3.org/2019/wot/json-schema#defining-a-json-ld-context-for-data-instances */
  "@context"?: {
    jsonld: "http://www.w3.org/ns/json-ld#";
    "jsonld:iri": { "@type": "@id" };
  };
  "jsonld:context"?: {
    "jsonld:definition": {
      "@type": "jsonld:TermDefinition";
      "jsonld:term": string;
      "jsonld:iri": string;
    }[];
  };
};

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

ajv.addKeyword({
  keyword: "author",
  schemaType: "string",
});
ajv.addKeyword({
  keyword: "entityTypeId",
  schemaType: "string",
});
/**
 * ajv has been patched as it disallows '@context' as a key (patch-package patches)
 * @todo figure out a proper way of dealing with this, might be using the wrong API
 *   only need this keyword at the root, not on properties
 */
ajv.addKeyword({
  keyword: "@context",
  schemaType: "object",
});
ajv.addKeyword({
  keyword: "jsonld:context",
  schemaType: "object",
});

const jsonSchemaVersion = "https://json-schema.org/draft/2019-09/schema";

/**
 * Generates a URI for a schema in blockprotocol.org, to use as its $id
 * */
const generateSchema$id = (entityTypeId: string) =>
  `${EntityType.DEFAULT_$ID_ORIGIN}/types/${entityTypeId}`;

/**
 * Create a JSON schema
 * @param params.author the namespace/username the schema belongs to
 * @param params.entityTypeId a globally unique id for this entity type
 * @param params.maybeSchema schema definition fields (in either a JSON string or JS object)
 *    (e.g. 'title', 'properties', 'description')
 */
export const validateAndCompleteJsonSchema = async (params: {
  author: string;
  entityTypeId: string;
  maybeSchema: unknown;
}): Promise<BlockProtocolEntityType["schema"]> => {
  const { author, entityTypeId, maybeSchema } = params;

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

  if (!title.match(/^[A-Z][A-Za-z0-9]+$/)) {
    throw new Error(
      "Schema 'title' must start with an uppercase letter, and contain only letters and numbers.",
    );
  }

  const schema = {
    ...parsedSchema,
    author,
    title: parsedSchema.title as string,
    type: typeof parsedSchema.type === "string" ? parsedSchema.type : "object",
    $schema: jsonSchemaVersion,
    $id: generateSchema$id(entityTypeId),
    entityTypeId,
  };

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
