import {
  DATA_TYPE_META_SCHEMA,
  ENTITY_TYPE_META_SCHEMA,
} from "@blockprotocol/type-system/slim";

export const hardcodedBpTypes = {
  "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1": {
    $schema: ENTITY_TYPE_META_SCHEMA,
    kind: "entityType",
    $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
    type: "object",
    title: "Link",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    title: "Text",
    description: "An ordered sequence of characters",
    type: "string",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    title: "Number",
    description: "An arithmetical value (in the Real number system)",
    type: "number",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1",
    title: "Null",
    description: "A placeholder value representing 'nothing'",
    type: "null",
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
  "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1",
    title: "Boolean",
    description: "A True or False value",
    type: "boolean",
  },
  "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1": {
    $schema: DATA_TYPE_META_SCHEMA,
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
    title: "Object",
    description: "An opaque, untyped JSON object",
    type: "object",
  },
} as const;
