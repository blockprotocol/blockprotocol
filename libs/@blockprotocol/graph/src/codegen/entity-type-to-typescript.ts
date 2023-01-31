import { VersionedUri } from "@blockprotocol/type-system";
import {
  EntityType,
  extractBaseUri,
  extractVersion,
} from "@blockprotocol/type-system/slim";
import { compile, Options } from "json-schema-to-typescript";

import { fetchAndValidateEntityType } from "../codegen.js";
import { typedEntries } from "../shared.js";
import { deduplicateTypeScriptStrings } from "./entity-type-to-typescript/deduplicate-ts-strings.js";
import {
  generateEntityDefinition,
  generateEntityLinkMapDefinition,
  generateImportStatements,
  generateLinkEntityAndRightEntityDefinition,
} from "./entity-type-to-typescript/type-definition-generators.js";
import { hardcodedBpTypes } from "./hardcoded-bp-types.js";
import { fetchTypeAsJson } from "./shared.js";

const bannerComment = (uri: string, depth: number) => `/**
 * This file was automatically generated – do not edit it.
 * @see ${uri} for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of ${depth} from the root
 */`;

/**
 * Uses json-schema-to-typescript to chase down $refs and create a TypeScript type for the provided schema
 * Ignores 'links' which are followed manually elsewhere in order to manage depth
 * @todo
 * - type name is generated from schema title. Clashes append 1, 2 etc. Patch this to distinguish on URI/$id segments?
 *   @see https://github.com/bcherny/json-schema-to-typescript/blob/34de194e87cd54f43809efae110732569e0891c1/src/parser.ts#L303
 *
 */
export const compileSchema = (schema: any, options?: Partial<Options>) =>
  compile(schema, "This value doesn't appear to matter", {
    strictIndexSignatures: true,
    // @see https://apitools.dev/json-schema-ref-parser/docs/options.html
    $refOptions: {
      dereference: {
        circular: true,
        onDereference: () => null, // @todo why is this required
      },
      resolve: {
        http: {
          read({ url }) {
            const hardcodedType =
              hardcodedBpTypes[url as keyof typeof hardcodedBpTypes];
            if (hardcodedType) {
              return hardcodedType;
            }
            return fetchTypeAsJson(url);
          },
        },
      },
    },
    ...options,
  });

// A named type and the TS string defining it and its type dependencies
type CompiledType = {
  typeName: string;
  typeScriptString: string;
};

// A map of schema URIs to their TS type name and definition
type UriToType = { [entityTypeId: VersionedUri]: CompiledType };

const generateTypeNameFromSchema = (
  schema: EntityType,
  existingTypes: UriToType,
): string => {
  if (!schema.title) {
    throw new Error("Schema must have a 'title'");
  }

  const nameToCase = schema.title.replace(/ /g, "");

  const proposedName = `${nameToCase[0]!.toUpperCase()}${nameToCase.substring(
    1,
  )}`;

  let typeWithProposedName = typedEntries(existingTypes).find(
    ([_entityTypeId, { typeName }]) => typeName === proposedName,
  );

  if (!typeWithProposedName) {
    return proposedName;
  }

  if (extractBaseUri(typeWithProposedName[0]) === extractBaseUri(schema.$id)) {
    // this is the same type at a different version, so we distinguish by version
    const nameWithVersionSuffix = `${proposedName}V${extractVersion(
      schema.$id,
    )}`;
    // need to check for a clash with a different, version-distinguished type
    return generateTypeNameFromSchema(
      {
        ...schema,
        title: nameWithVersionSuffix,
      },
      existingTypes,
    );
  }

  // fallback to a simple counter
  // @todo use URI segments or something else to distinguish, not a counter
  let i = 0;
  do {
    i++;
    const nameWithCounterSuffix = `${proposedName}${i}`;
    typeWithProposedName = typedEntries(existingTypes).find(
      ([_entityTypeId, { typeName }]) => typeName === nameWithCounterSuffix,
    );
  } while (typeWithProposedName);

  return `${proposedName}${i}`;
};

/**
 * Generates TypeScript types from a given Entity Type schema
 * If depth > 0, follows 'links' from the schema to include types for link entities and their possible destinations
 * @param schema – the schema to generate types for
 * @param depth – the depth to which the graph of _entity type_ schemas linked from this schema will be resolved
 * @param resolvedUrisToType – a map of already-resolved schemas to skip type generation for
 */
const _jsonSchemaToTypeScript = async (
  schema: EntityType,
  depth: number,
  resolvedUrisToType: UriToType,
): Promise<CompiledType> => {
  if (resolvedUrisToType[schema.$id]) {
    return resolvedUrisToType[schema.$id]!;
  }

  // if the cache is empty, this is the schema the external caller provided. we need to know to add boilerplate up top
  const rootSchema = Object.keys(resolvedUrisToType).length === 0;

  const typeName = generateTypeNameFromSchema(schema, resolvedUrisToType);

  if (!typeName) {
    throw new Error("Schema is missing a title");
  }

  // This first generated type is just going to cover the entity's properties – they have other fields typed elsewhere
  const propertyTypeName = `${typeName}Properties`;

  // here we import the types defined elsewhere which we rely on, e.g. Entity
  let compiledSchema = rootSchema ? generateImportStatements() : "";

  // Generate the type for FooProperties, representing the entity's 'own properties' (not links or linked entities)
  compiledSchema += await compileSchema(
    { ...schema, title: propertyTypeName },
    {
      additionalProperties: false, // @todo add additionalProperties: false to entity type JSON schemas
      bannerComment: rootSchema ? bannerComment(schema.$id, depth) : "",
    },
  );

  // This adds 'type Foo = Entity<FooProperties>;'
  const entityTypeDefinition = generateEntityDefinition(
    typeName,
    propertyTypeName,
  );
  compiledSchema += entityTypeDefinition;

  // using a type instead of an interface allows using FooProperties in Entity<FooProperties>
  // matching group needed in case the compiler has made e.g. FooProperties1 & FooProperties2 to handle inheritance
  // @todo we need to catch types generated internally by the library via inheritance (allOf), which we don't know about
  //   either these need to be converted to types too, or we need a different approach to Entity<Properties>
  compiledSchema = compiledSchema.replace(
    new RegExp(`export interface (${typeName}Properties\\S*)`, "g"),
    `export type $1 =`,
  );

  // temporary hack for the @todo mentioned above
  // this covers the one type we know is currently generated via inheritance
  compiledSchema = compiledSchema.replace(
    /export interface Link/g,
    "export type Link =",
  );

  // Better type for the opaque JSON object type
  compiledSchema = compiledSchema.replaceAll(
    "export interface Object {}",
    "export type Object = JsonObject;",
  );

  const compiledType = { typeName, typeScriptString: compiledSchema };

  // add the compiled type to our map of already-resolved types in case it's encountered again when following links
  // eslint-disable-next-line no-param-reassign -- this is intentionally mutated when this function is called
  resolvedUrisToType[schema.$id] = compiledType;

  if (depth === 0) {
    return compiledType;
  }

  // if we're following links, we want to generate various types that can be plugged into subgraph functions

  // keep track of the possible destination types from this entity type for each link type it includes
  const typeLinkMap: Record<VersionedUri, string> = {};

  for (const [linkEntityTypeId, destinationSchema] of typedEntries(
    schema.links ?? {},
  )) {
    const retrieveOrCompileSchemaFromUri = async (
      uri: VersionedUri,
    ): Promise<CompiledType> => {
      const cachedType = resolvedUrisToType[uri];
      if (cachedType) {
        return {
          typeName: cachedType.typeName,
          typeScriptString: "",
        };
      }
      const typeSchema = await fetchAndValidateEntityType(uri as VersionedUri);
      return _jsonSchemaToTypeScript(typeSchema, depth - 1, resolvedUrisToType);
    };

    // get the schema for the linkEntity and possible rightEntities for this link, from this entity
    const [linkEntityType, ...rightEntityTypes] = await Promise.all([
      retrieveOrCompileSchemaFromUri(linkEntityTypeId),
      ...("oneOf" in destinationSchema.items
        ? destinationSchema.items.oneOf
        : []
      ).map((option) => retrieveOrCompileSchemaFromUri(option.$ref)),
    ]);

    // generate the appropriate type, a narrower version of the type e.g. getOutgoingLinkAndTargetEntities returns
    const { typeDefinition: linkEntityTypeDefinition, typeName: linkTypeName } =
      generateLinkEntityAndRightEntityDefinition({
        sourceEntityTypeName: typeName,
        linkEntityTypeName: linkEntityType.typeName,
        rightEntityTypeNames: (rightEntityTypes.length > 0
          ? rightEntityTypes
          : [{ typeName: "Entity" }]
        ).map((type) => type.typeName),
      });

    compiledSchema = deduplicateTypeScriptStrings([
      compiledSchema,
      linkEntityType.typeScriptString,
      ...rightEntityTypes.map(
        (rightEntityType) => rightEntityType.typeScriptString,
      ),
      linkEntityTypeDefinition,
    ]);

    typeLinkMap[linkEntityTypeId] = linkTypeName;
  }

  // add a map of all the link type URIs we processed -> the possible linkEntity/rightEntities they link to
  const { linkDefinitionString, linkAndRightEntitiesUnionName, mapTypeName } =
    generateEntityLinkMapDefinition(typeName, typeLinkMap);

  compiledSchema += linkDefinitionString;

  if (rootSchema) {
    compiledSchema += `\n
export type RootEntity = ${typeName};
export type RootEntityLinkedEntities = ${linkAndRightEntitiesUnionName};
export type RootLinkMap = ${mapTypeName};`;
  }

  return {
    typeName,
    typeScriptString: compiledSchema,
  };
};

/**
 * @todo check with more complex types
 */
export const entityTypeToTypeScript = async (
  rootSchema: EntityType,
  depth = 0,
) => {
  return _jsonSchemaToTypeScript(rootSchema, depth, {});
};
