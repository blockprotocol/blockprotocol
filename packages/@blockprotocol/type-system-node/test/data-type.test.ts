import { DataType, isValidDataType } from "..";

const primitiveDataTypes: DataType[] = [
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
const invalidDataTypes: DataType[] = [
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/", // unversioned URI
    title: "Text",
    description: "An ordered sequence of characters",
    type: "string",
  },
];

// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenTypes: any[] = [
  {},
  { foo: "bar" },
  {
    kind: "dataType",
    $id: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
    title: "Text",
  },
];

describe("isValidDataType", () => {
  test.each(primitiveDataTypes)("isValidDataType($title) succeeds", (input) => {
    expect(() => isValidDataType(input)).not.toThrow();
  });

  test.each(invalidDataTypes)(
    "isValidDataType errors on invalid data type: %s",
    (input) => {
      expect(() => isValidDataType(input)).toThrow();
    },
  );

  test.each(brokenTypes)(
    "isValidDataType cleanly errors on different type: %s",
    (input) => {
      expect(() => isValidDataType(input)).toThrow();
    },
  );
});
