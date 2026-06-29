/*
 @todo - We should be able to import these from the `@blockprotocol/graph` package here but we're running into strange errors
   with "Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime" only on
   the integration tests CI job
*/
const DATA_TYPE_META_SCHEMA =
  "https://blockprotocol.org/types/modules/graph/0.3/schema/data-type";
const ENTITY_TYPE_META_SCHEMA =
  "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type";
const PROPERTY_TYPE_META_SCHEMA =
  "https://blockprotocol.org/types/modules/graph/0.3/schema/property-type";

/* istanbul ignore file */
export const hardcodedTypes = {
  // Data types
  "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
    title: "Value",
    description:
      "A piece of data that can be used to convey information about an attribute, quality or state of something.",
    anyOf: [
      { type: "null" },
      { type: "boolean" },
      { type: "number" },
      { type: "string" },
      { type: "array" },
      { type: "object" },
    ],
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "Text",
    description: "An ordered sequence of characters",
    type: "string",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "Number",
    description: "An arithmetical value (in the Real number system)",
    type: "number",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "Boolean",
    description: "A True or False value",
    type: "boolean",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "Null",
    description: "A placeholder value representing 'nothing'",
    type: "null",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "Object",
    description: "An opaque, untyped JSON object",
    type: "object",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/list/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/list/v/1",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/value/v/1",
      },
    ],
    title: "List",
    description: "An ordered list of values",
    type: "array",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1",
    title: "Empty List",
    description: "An Empty List",
    type: "array",
    const: [],
  },
  // Entity types
  "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1": {
    $schema: ENTITY_TYPE_META_SCHEMA,
    kind: "entityType",
    $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    type: "object",
    title: "Link",
    description:
      "The most generic connection between two entities, defining a relationship from a source to a target. It serves as a parent type for more specific link entity types, enabling consistent and interoperable data relationships.",
    properties: {},
  },
  "https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/1": {
    $schema: ENTITY_TYPE_META_SCHEMA,
    kind: "entityType",
    $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/1",
    type: "object",
    title: "Thing",
    description: "A generic thing",
    allOf: [],
    links: {},
    properties: {},
    required: [],
  },
  "https://blockprotocol.org/@hash/types/entity-type/query/v/1": {
    $schema: ENTITY_TYPE_META_SCHEMA,
    kind: "entityType",
    $id: "https://blockprotocol.org/@hash/types/entity-type/query/v/1",
    type: "object",
    title: "Query",
    description: "",
    allOf: [],
    links: {},
    properties: {
      "https://blockprotocol.org/@hash/types/property-type/query/": {
        $ref: "https://blockprotocol.org/@hash/types/property-type/query/v/1",
      },
    },
    required: ["https://blockprotocol.org/@hash/types/property-type/query/"],
  },
  "https://blockprotocol.org/@hash/types/entity-type/has-query/v/1": {
    $schema: ENTITY_TYPE_META_SCHEMA,
    kind: "entityType",
    $id: "https://blockprotocol.org/@hash/types/entity-type/has-query/v/1",
    type: "object",
    title: "Has Query",
    description: "The query that something has.",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
      },
    ],
    links: {},
    properties: {},
    required: [],
  },
  // Property types
  "https://blockprotocol.org/@blockprotocol/types/property-type/description/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/description/v/1",
      title: "Description",
      description:
        "A piece of text that tells you about something or someone. This can include explaining what they look like, what its purpose is for, what they’re like, etc.",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/display-name/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/display-name/v/1",
      title: "Display Name",
      description: "A human-friendly display name for something",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/file-hash/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/file-hash/v/1",
      title: "File Hash",
      description: "A unique signature derived from a file's contents",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/file-name/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/file-name/v/1",
      title: "File Name",
      description: "The name of a file.",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/file-size/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/file-size/v/1",
      title: "File Size",
      description: "The size of a file",
      oneOf: [
        {
          $ref: "https://hash.ai/@h/types/data-type/bytes/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/file-url/v/1": {
    $schema: PROPERTY_TYPE_META_SCHEMA,
    kind: "propertyType",
    $id: "https://blockprotocol.org/@blockprotocol/types/property-type/file-url/v/1",
    title: "File URL",
    description: "A URL that serves a file.",
    oneOf: [
      {
        $ref: "https://hash.ai/@h/types/data-type/uri/v/1",
      },
    ],
  },
  "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/v/1",
      title: "MIME Type",
      description:
        "A MIME (Multipurpose Internet Mail Extensions) type.\n\nSee: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/v/1": {
    $schema: PROPERTY_TYPE_META_SCHEMA,
    kind: "propertyType",
    $id: "https://blockprotocol.org/@blockprotocol/types/property-type/name/v/1",
    title: "Name",
    description:
      "A word or set of words by which something is known, addressed, or referred to.",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  "https://blockprotocol.org/@blockprotocol/types/property-type/original-file-name/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/original-file-name/v/1",
      title: "Original File Name",
      description: "The original name of a file",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/original-source/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/original-source/v/1",
      title: "Original Source",
      description: "The original source of something",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@blockprotocol/types/property-type/original-url/v/1":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/original-url/v/1",
      title: "Original URL",
      description: "The original URL something was hosted at",
      oneOf: [
        {
          $ref: "https://hash.ai/@h/types/data-type/uri/v/1",
        },
      ],
    },
  "https://blockprotocol.org/@hash/types/property-type/query/v/1": {
    $schema: PROPERTY_TYPE_META_SCHEMA,
    kind: "propertyType",
    $id: "https://blockprotocol.org/@hash/types/property-type/query/v/1",
    title: "query",
    description: "The query for something.",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
      },
    ],
  },
  "https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/v/2":
    {
      $schema: PROPERTY_TYPE_META_SCHEMA,
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/v/2",
      title: "Textual Content",
      description:
        "The text material, information, or body, that makes up the content of this thing.",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
        },
        {
          type: "array",
          items: {
            oneOf: [
              {
                $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
              },
            ],
          },
        },
      ],
    },
} as const;
