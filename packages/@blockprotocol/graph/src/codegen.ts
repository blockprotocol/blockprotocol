// This file has its own import path "@blockprotocol/graph/codegen"
// because its dependencies hit a lot of node APIs – this is intended for CLI use.
// we don't want users importing from other files in the package to have to evaluate it.
// it will cause problems with e.g. webpack which would require polyfills for the node APIs

import { EntityType, VersionedUri } from "@blockprotocol/type-system/slim";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import entityTypeMetaSchema from "./codegen/entity-type-meta-schema.json" assert { type: "json" };
import { entityTypeToTypeScript } from "./codegen/entity-type-to-typescript.js";
import { fetchTypeAsJson } from "./codegen/shared.js";

const ajv = new Ajv2020();
addFormats(ajv);

const entityTypeValidator = await ajv.compile<EntityType>(entityTypeMetaSchema);

/**
 * Validates that the schema at a given URI is a valid Entity Type
 * @param versionedUri – the URI / $id of the schema
 * @throws if there are validation errors or if the schema is unreachable
 */
export const fetchAndValidateEntityType = async (
  versionedUri: VersionedUri,
) => {
  const entityTypeSchema = await fetchTypeAsJson(versionedUri);

  if (!entityTypeValidator(entityTypeSchema)) {
    // eslint-disable-next-line no-console -- useful for debugging, intended as a CLI tool
    console.error(
      `Error validating entity type schema at ${versionedUri}:\n`,
      JSON.stringify(entityTypeValidator.errors, undefined, 2),
    );
    throw entityTypeValidator.errors;
  }

  return entityTypeSchema;
};

/**
 * Generates a string containing TypeScript type definitions for a given Entity Type
 * @param versionedUri – the URI at which the Entity Type is available
 * @param depth – how many links to follow when generating types.
 *   - 0 will generate types for the Entity Type's properties only
 *   - 1 will generate types for the links from the Entity Type and their possible destination entities
 *   - 2 will generate types for the linked entities plus _their_ links and destinations, and so on
 */
export const generateTypeScriptFromEntityType = async (
  versionedUri: VersionedUri,
  depth: number = 0,
) => {
  const entityTypeSchema = await fetchAndValidateEntityType(versionedUri);

  return entityTypeToTypeScript(entityTypeSchema, depth);
};
