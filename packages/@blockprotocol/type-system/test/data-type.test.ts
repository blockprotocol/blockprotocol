import test from "ava";

import { DataType, ParseDataTypeError, validateDataType } from "../dist";
import { truncate } from "./shared/truncate";

const dataTypes: DataType[] = [
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/boolean/v/1",
    title: "Boolean",
    description: "A True or False value",
    type: "boolean",
  },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/empty-list/v/1",
    title: "Empty List",
    description: "An Empty List",
    type: "array",
    const: [],
  },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/null/v/1",
    title: "Null",
    description: "A placeholder value representing 'nothing'",
    type: "null",
  },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
    title: "Number",
    description: "An arithmetical value (in the Real number system)",
    type: "number",
  },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/object/v/1",
    title: "Object",
    description: "A plain JSON object with no pre-defined structure",
    type: "object",
  },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    title: "Text",
    description: "An ordered sequence of characters",
    type: "string",
  },
];

// These are data types which satisfy the TypeScript interface but are still invalid, and demonstrate the need for the
// validation method
const invalidDataTypeCases: [string, DataType, ParseDataTypeError][] = [
  [
    "incorrectly versioned URI",
    {
      kind: "dataType",
      $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/2.3",
      title: "Text",
      description: "An ordered sequence of characters",
      type: "string",
    },
    {
      reason: "InvalidVersionedUri",
      inner: {
        reason: "AdditionalEndContent",
      },
    },
  ],
];

// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenDataTypeCases: [any, ParseDataTypeError][] = [
  [
    {},
    {
      reason: "InvalidJson",
      inner: "missing field `kind` at line 1 column 2",
    },
  ],
  [
    { foo: "bar" },
    {
      reason: "InvalidJson",
      inner: "missing field `kind` at line 1 column 13",
    },
  ],
  [
    {
      kind: "dataType",
      $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      title: "Text",
    },
    {
      reason: "InvalidJson",
      inner: "missing field `type` at line 1 column 108",
    },
  ],
];

for (const primitiveDataType of dataTypes) {
  test(`validateDataType(${primitiveDataType.title}) succeeds`, (t) => {
    t.deepEqual(validateDataType(primitiveDataType), {
      type: "Ok",
      inner: null,
    });
  });
}

for (const [description, invalidDataType, expected] of invalidDataTypeCases) {
  test(`validateDataType returns errors on: ${description}`, (t) => {
    t.deepEqual(validateDataType(invalidDataType), {
      type: "Err",
      inner: expected,
    });
  });
}

for (const [brokenType, expected] of brokenDataTypeCases) {
  test(`validateDataType returns errors on broken type: ${truncate(
    brokenType,
  )}`, (t) => {
    t.deepEqual(validateDataType(brokenType), {
      type: "Err",
      inner: expected,
    });
  });
}
