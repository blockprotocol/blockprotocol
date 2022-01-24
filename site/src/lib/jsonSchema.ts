import { JSONObject, JSONValue } from "blockprotocol";
import Ajv2019 from "ajv/dist/2019";

import { EntityType } from "./model/entityType.model";

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

export const ajv = new Ajv2019({
  addUsedSchema: false, // stop AJV trying to add compiled schemas to the instance
  loadSchema: loadEmptyExternalSchema,
});

export const jsonSchemaVersion = "https://json-schema.org/draft/2019-09/schema";

/**
 * Generates a URI for a schema in blockprotocol.org, to use as its $id
 * */
export const generateSchema$id = (entityTypeId: string) =>
  `${EntityType.DEFAULT_$ID_ORIGIN}/types/${entityTypeId}`;

export type JSONSchema = {
  $id: string;
  $schema: string;
  title: string;
  [key: string]: JSONValue;
};

/**
 * Create a JSON schema
 * @param entityTypeId a globally unique id for this entity type
 * @param maybeSchema schema definition fields (in either a JSON string or JS object)
 *    (e.g. 'title', 'properties', 'description')
 */
export const validateAndCompleteJsonSchema = async (
  entityTypeId: string,
  maybeSchema: unknown,
): Promise<JSONSchema> => {
  if (
    (typeof maybeSchema !== "string" && typeof maybeSchema !== "object") ||
    maybeSchema == null
  ) {
    throw new Error("Schema must be either a JSON string or parsed object.");
  }

  let parsedSchema: JSONObject;
  try {
    parsedSchema =
      typeof maybeSchema === "string"
        ? JSON.parse(maybeSchema)
        : JSON.parse(JSON.stringify(maybeSchema));
  } catch (err) {
    throw new Error(`Could not parse schema: ${err.message}`);
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
    title: parsedSchema.title as string,
    $schema: jsonSchemaVersion,
    $id: generateSchema$id(entityTypeId),
  };

  try {
    await ajv.compileAsync(schema);
  } catch (err) {
    throw new Error(`Could not compile schema: ${err.message}`);
  }

  return schema;
};
