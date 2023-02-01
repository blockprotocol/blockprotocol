export const hardcodedTypes = {
  // @todo replace this with a type in the db when new type hosting available
  "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1": {
    kind: "entityType",
    $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    type: "object",
    title: "Link",
    properties: {},
    additionalProperties: false,
  },
  // @todo replace below data types with types in db when data type hosting available
  "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    title: "Text",
    description: "An ordered sequence of characters",
    type: "string",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    title: "Number",
    description: "An arithmetical value (in the Real number system)",
    type: "number",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1",
    title: "Null",
    description: "A placeholder value representing 'nothing'",
    type: "null",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1",
    title: "Empty List",
    description: "An Empty List",
    type: "array",
    const: [],
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1",
    title: "Boolean",
    description: "A True or False value",
    type: "boolean",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1": {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
    title: "Object",
    description: "An opaque, untyped JSON object",
    type: "object",
  },
} as const;
