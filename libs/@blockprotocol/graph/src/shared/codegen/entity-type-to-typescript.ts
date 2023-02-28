import {
  EntityType,
  extractBaseUrl,
  extractVersion,
  validateVersionedUrl,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";
import { compile, JSONSchema, Options } from "json-schema-to-typescript";

import { fetchAndValidateEntityType } from "../../non-temporal/codegen.js";
import { typedEntries } from "../util.js";
import { deduplicateTypeScriptStrings } from "./entity-type-to-typescript/deduplicate-ts-strings.js";
import {
  generateEntityDefinition,
  generateEntityLinkMapDefinition,
  generateImportStatements,
  generateLinkEntityAndRightEntityDefinition,
} from "./entity-type-to-typescript/type-definition-generators.js";
import { hardcodedBpTypes } from "./hardcoded-bp-types.js";
import { fetchTypeAsJson } from "./shared.js";

const bannerComment = (url: string, depth: number) => `/**
 * This file was automatically generated – do not edit it.
 * @see ${url} for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of ${depth} from the root
 */`;

/**
 * Extracts the alphanumeric characters from the title and creates a Title Cased version that can be used as a
 * TypeScript type name
 *
 * @param title
 */
const generateTypeNameFromTitle = (title: string) => {
  // extract all letters and numbers from the title, and capitalise the start of each component
  const titleCase = (title.match(/[a-zA-Z0-9]+/g) || [])
    .map((word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join("");

  if (!/[a-zA-Z]/.test(titleCase.charAt(0))) {
    // if it starts with a number, append `T` to the start to make a valid type name
    return `T${titleCase}`;
  } else {
    return titleCase;
  }
};

const generateTypeNameFromSchema = (
  schema: { $id: VersionedUrl; title: string },
  existingTypes: UrlToType,
): string => {
  const proposedName = generateTypeNameFromTitle(schema.title);

  let typeWithProposedName = typedEntries(existingTypes).find(
    ([_entityTypeId, { typeName }]) => typeName === proposedName,
  );

  if (!typeWithProposedName) {
    return proposedName;
  }

  if (extractBaseUrl(typeWithProposedName[0]) === extractBaseUrl(schema.$id)) {
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
  // @todo use URL segments or something else to distinguish, not a counter
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
 * Uses json-schema-to-typescript to chase down $refs and create a TypeScript type for the provided schema
 * Ignores 'links' which are followed manually elsewhere in order to manage depth
 * @todo
 * - type name is generated from schema title. Clashes append 1, 2 etc. Patch this to distinguish on URL/$id segments?
 *   @see https://github.com/bcherny/json-schema-to-typescript/blob/34de194e87cd54f43809efae110732569e0891c1/src/parser.ts#L303
 *
 */
export const compileSchema = ({
  schema,
  options,
  resolvedUrlsToType,
}: {
  schema: any;
  options?: Partial<Options>;
  resolvedUrlsToType: UrlToType;
}) =>
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
            return (async () => {
              let type =
                (hardcodedBpTypes as Record<string, unknown>)[url] ??
                (await fetchTypeAsJson(url));

              if (validateVersionedUrl(url).type === "Ok") {
                if (typeof type !== "object" || type === null) {
                  // eslint-disable-next-line no-console
                  console.error(`Expected type at ${url} to be valid JSON`);
                  throw new Error(`Expected type at ${url} to be valid JSON`);
                }

                // Spread the type to avoid modifying contents of `hardcodedBpTypes`
                const remoteSchema = { ...type };

                if (
                  !(
                    "$id" in remoteSchema &&
                    typeof remoteSchema.$id === "string" &&
                    validateVersionedUrl(remoteSchema.$id).type === "Ok"
                  )
                ) {
                  // eslint-disable-next-line no-console
                  console.error(
                    `Expected type at ${url} to have a valid $id Versioned URL`,
                  );
                  throw new Error(
                    `Expected type at ${url} to have a valid $id Versioned URL`,
                  );
                }

                if (
                  !(
                    "kind" in remoteSchema &&
                    typeof remoteSchema.kind === "string"
                  )
                ) {
                  // eslint-disable-next-line no-console
                  console.error(
                    `Expected type at ${url} to have a string 'kind' property`,
                  );
                  throw new Error(
                    `Expected type at ${url} to have a string 'kind' property`,
                  );
                }

                if (
                  !(
                    "title" in remoteSchema &&
                    typeof remoteSchema.title === "string"
                  )
                ) {
                  // eslint-disable-next-line no-console
                  console.error(
                    `Expected type at ${url} to have a string 'title' property`,
                  );
                  throw new Error(
                    `Expected type at ${url} to have a string 'title' property`,
                  );
                }

                if (
                  !["entityType", "propertyType", "dataType"].includes(
                    remoteSchema.kind,
                  )
                ) {
                  // eslint-disable-next-line no-console
                  console.error(
                    `Expected type at ${url} to have a 'kind' of 'entityType', 'propertyType' or 'dataType'`,
                  );

                  throw new Error(
                    `Expected type at ${url} to have a 'kind' of 'entityType', 'propertyType' or 'dataType'`,
                  );
                }

                if (remoteSchema.kind === "propertyType") {
                  remoteSchema.title = `${remoteSchema.title} Property Value`;
                } else if (remoteSchema.kind === "dataType") {
                  remoteSchema.title = `${remoteSchema.title} Data Value`;
                }

                const proposedName = generateTypeNameFromTitle(
                  /* @todo - this is checked above so we shouldn't have to cast here */
                  remoteSchema.title as string,
                );

                const [resolvedUrl, _] =
                  Object.entries(resolvedUrlsToType).find(
                    ([_resolvedUrl, compiledType]) =>
                      compiledType.typeName === proposedName,
                  ) ?? [];

                if (resolvedUrl && resolvedUrl !== url) {
                  remoteSchema.title = generateTypeNameFromSchema(
                    /* @todo - this is checked above so we shouldn't have to cast here */
                    remoteSchema as { $id: VersionedUrl; title: string },
                    resolvedUrlsToType,
                  );
                }

                type = remoteSchema;
              }

              return type;
            })();
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

// A map of schema URLs to their TS type name and definition
type UrlToType = { [entityTypeId: VersionedUrl]: CompiledType };

/**
 * Generates TypeScript types from a given Entity Type schema
 * If depth > 0, follows 'links' from the schema to include types for link entities and their possible destinations
 * @param schema – the schema to generate types for
 * @param depth – the depth to which the graph of _entity type_ schemas linked from this schema will be resolved
 * @param resolvedUrlsToType – a map of already-resolved schemas to skip type generation for
 * @param temporal – whether or not the generated code should support temporal versioning
 */
const _jsonSchemaToTypeScript = async (
  schema: EntityType,
  depth: number,
  resolvedUrlsToType: UrlToType,
  temporal: boolean,
): Promise<CompiledType> => {
  if (resolvedUrlsToType[schema.$id]) {
    return resolvedUrlsToType[schema.$id]!;
  }

  // if the cache is empty, this is the schema the external caller provided. we need to know to add boilerplate up top
  const rootSchema = Object.keys(resolvedUrlsToType).length === 0;

  const typeName = generateTypeNameFromSchema(schema, resolvedUrlsToType);

  if (!typeName) {
    throw new Error("Schema is missing a title");
  }

  // This first generated type is just going to cover the entity's properties – they have other fields typed elsewhere
  const propertiesTypeName = `${typeName}Properties`;

  // here we import the types defined elsewhere which we rely on, e.g. Entity
  let compiledSchema = rootSchema ? generateImportStatements(temporal) : "";

  if (
    schema.allOf &&
    schema.allOf.length > 0 &&
    schema.allOf[0]!.$ref !==
      "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1"
  ) {
    throw new Error(
      `Invalid allOf entry, expected 'https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1' by received: ${
        schema.allOf[0]!.$ref
      }}`,
    );
  }

  if (schema.allOf !== undefined) {
    // eslint-disable-next-line no-param-reassign -- must be deleted. an empty array -> garbage output, null/undefined -> crash
    delete schema.allOf;
  }

  // Generate the type for FooProperties, representing the entity's 'own properties' (not links or linked entities)
  compiledSchema += await compileSchema({
    schema: {
      ...schema,
      title: propertiesTypeName,
    },
    options: {
      additionalProperties: false,
      bannerComment: rootSchema ? bannerComment(schema.$id, depth) : "",
    },
    resolvedUrlsToType,
  });

  // This adds 'type Foo = Entity<FooProperties>;'
  const entityTypeDefinition = generateEntityDefinition(
    typeName,
    propertiesTypeName,
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
    /export interface Link /g,
    "export type Link = ",
  );

  // Better type for the opaque JSON object type
  compiledSchema = compiledSchema.replaceAll(
    "export interface Object {}",
    "export type Object = JsonObject;",
  );

  const compiledType = { typeName, typeScriptString: compiledSchema };

  // add the compiled type to our map of already-resolved types in case it's encountered again when following links
  // eslint-disable-next-line no-param-reassign -- this is intentionally mutated when this function is called
  resolvedUrlsToType[schema.$id] = compiledType;

  if (depth === 0) {
    return compiledType;
  }

  // if we're following links, we want to generate various types that can be plugged into subgraph functions

  // keep track of the possible destination types from this entity type for each link type it includes
  const typeLinkMap: Record<VersionedUrl, string> = {};

  for (const [linkEntityTypeId, destinationSchema] of typedEntries(
    schema.links ?? {},
  )) {
    const retrieveOrCompileSchemaFromUrl = async (
      url: VersionedUrl,
    ): Promise<CompiledType> => {
      const cachedType = resolvedUrlsToType[url];
      if (cachedType) {
        return {
          typeName: cachedType.typeName,
          typeScriptString: "",
        };
      }
      const typeSchema = await fetchAndValidateEntityType(url as VersionedUrl);
      return _jsonSchemaToTypeScript(
        typeSchema,
        depth - 1,
        resolvedUrlsToType,
        temporal,
      );
    };

    // get the schema for the linkEntity and possible rightEntities for this link, from this entity
    const [linkEntityType, ...rightEntityTypes] = await Promise.all([
      retrieveOrCompileSchemaFromUrl(linkEntityTypeId),
      ...("oneOf" in destinationSchema.items
        ? destinationSchema.items.oneOf
        : []
      ).map((option) => retrieveOrCompileSchemaFromUrl(option.$ref)),
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

  // add a map of all the link type URLs we processed -> the possible linkEntity/rightEntities they link to
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
  temporal: boolean,
  depth = 0,
) => {
  return _jsonSchemaToTypeScript(rootSchema, depth, {}, temporal);
};
