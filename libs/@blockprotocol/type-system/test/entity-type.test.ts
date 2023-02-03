import {
  EntityType,
  ParseEntityTypeError,
  TypeSystemInitializer,
  validateEntityType,
} from "..";

const entityTypes: EntityType[] = [
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
    type: "object",
    title: "UK Address",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/address-line-1/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
      },
      "https://blockprotocol.org/@alice/types/property-type/postcode/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/postcode/v/1",
      },
      "https://blockprotocol.org/@alice/types/property-type/city/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/city/v/1",
      },
    },
    required: [
      "https://blockprotocol.org/@alice/types/property-type/address-line-1/",
      "https://blockprotocol.org/@alice/types/property-type/postcode/",
      "https://blockprotocol.org/@alice/types/property-type/city/",
    ],
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/block/v/1",
    title: "Block",
    type: "object",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    required: ["https://blockprotocol.org/@alice/types/property-type/name/"],
    default: {
      "https://blockprotocol.org/@alice/types/property-type/name/": "MyBlock",
    },
    examples: [
      {
        "https://blockprotocol.org/@alice/types/property-type/name/":
          "MyBlock2",
      },
      {
        "https://blockprotocol.org/@alice/types/property-type/name/":
          "YourBlock",
      },
    ],
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/book/v/1",
    title: "Book",
    type: "object",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        type: "array",
        items: {
          $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
        },
      },
      "https://blockprotocol.org/@alice/types/property-type/blurb/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/blurb/v/1",
      },
      "https://blockprotocol.org/@alice/types/property-type/published-on/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/published-on/v/1",
      },
    },
    required: ["https://blockprotocol.org/@alice/types/property-type/name/"],
    links: {
      "https://blockprotocol.org/@alice/types/entity-type/written-by/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            },
          ],
        },
        ordered: false,
      },
    },
    requiredLinks: [
      "https://blockprotocol.org/@alice/types/entity-type/written-by/v/1",
    ],
    examples: [],
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/building/v/1",
    type: "object",
    title: "Building",
    properties: {},
    links: {
      "https://blockprotocol.org/@alice/types/entity-type/located-at/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
            },
          ],
        },
        maxItems: 1,
        ordered: false,
      },
      "https://blockprotocol.org/@alice/types/entity-type/tenant/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            },
          ],
        },
        ordered: false,
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/organization/v/1",
    type: "object",
    title: "Organization",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/organization/v/1",
    type: "object",
    title: "Organization",
    allOf: [],
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/page/v/2",
    type: "object",
    title: "Page",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/text/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/text/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/entity-type/written-by/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            },
          ],
        },
        ordered: false,
      },
      "https://blockprotocol.org/@alice/types/entity-type/contains/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/block/v/1",
            },
          ],
        },
        ordered: true,
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
    type: "object",
    title: "Person",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/entity-type/friend-of/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
            },
          ],
        },
        ordered: false,
      },
      "https://blockprotocol.org/@alice/types/entity-type/owns/v/1": {
        type: "array",
        items: {},
        ordered: false,
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/playlist/v/1",
    type: "object",
    title: "Playlist",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/entity-type/contains/v/1": {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@alice/types/entity-type/song/v/1",
            },
          ],
        },
        ordered: true,
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/song/v/1",
    type: "object",
    title: "Song",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    additionalProperties: false,
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/knows/v/1",
    type: "object",
    title: "Knows",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
      },
    ],
    properties: {},
    additionalProperties: false,
  },
];

// These are data types which satisfy the TypeScript interface but are still invalid, and demonstrate the need for the
// validation method
const invalidEntityTypes: [string, EntityType, ParseEntityTypeError][] = [
  [
    "non-integer version ID",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1.2",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidVersionedUri",
      inner: {
        reason: "AdditionalEndContent",
      },
    },
  ],
  [
    "invalid base URI",
    {
      kind: "entityType",
      $id: "https://  /broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidVersionedUri",
      inner: {
        reason: "InvalidBaseUri",
        inner: {
          reason: "UrlParseError",
          inner: "invalid domain character",
        },
      },
    },
  ],
  [
    "invalid ref",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "im a broken ref haha /v/1",
          },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidPropertyTypeObject",
      inner: {
        reason: "InvalidPropertyTypeReference",
        inner: {
          reason: "InvalidBaseUri",
          inner: {
            reason: "UrlParseError",
            inner: "relative URL without a base",
          },
        },
      },
    },
  ],
  [
    "invalid property type object",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidPropertyTypeObject",
      inner: {
        reason: "InvalidPropertyKey",
        inner: {
          reason: "MissingTrailingSlash",
        },
      },
    },
  ],
  [
    "invalid default",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      default: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/2.3":
          "My Address 32, My Street, Narnia",
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidDefaultKey",
      inner: {
        reason: "MissingTrailingSlash",
      },
    },
  ],
  [
    "invalid link uri",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      links: {
        "https://blockprotocol.org/@alice/types/entity-type/friend-of/v/1.3": {
          type: "array",
          items: {
            oneOf: [
              {
                $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
              },
            ],
          },
          ordered: false,
        },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidPropertyTypeObject",
      inner: {
        reason: "InvalidPropertyKey",
        inner: {
          reason: "MissingTrailingSlash",
        },
      },
    },
  ],
  [
    "invalid link inner ref",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      links: {
        "https://blockprotocol.org/@alice/types/entity-type/friend-of/v/1": {
          type: "array",
          items: {
            oneOf: [
              {
                $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1.4",
              },
            ],
          },
          ordered: false,
        },
      },
      additionalProperties: false,
    },
    {
      reason: "InvalidPropertyTypeObject",
      inner: {
        reason: "InvalidPropertyKey",
        inner: {
          reason: "MissingTrailingSlash",
        },
      },
    },
  ],
  [
    "Broken ref in inheritance",
    {
      kind: "entityType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      type: "object",
      title: "Broken",
      allOf: [
        {
          $ref: "https://blockprotocol.org/@alice/types/property-type/link/v/1.2",
        },
      ],
      properties: {},
      additionalProperties: false,
    },
    {
      reason: "InvalidAllOf",
      inner: {
        reason: "EntityTypeReferenceError",
        inner: {
          reason: "AdditionalEndContent",
        },
      },
    },
  ],
];
// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenTypes: [any, ParseEntityTypeError][] = [
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
      kind: "entityType",
      $id: "https://blockprotocol.org/@alice/types/entity-type/foo/v/1",
      type: "object",
      title: "Foo",
      allOf: [],
      properties: {},
      additionalProperties: true,
    },
    {
      reason: "InvalidAdditionalPropertiesValue",
    },
  ],
];

beforeAll(async () => {
  await TypeSystemInitializer.initialize();
});

describe("validateEntityType", () => {
  test.each(entityTypes)("validateEntityType($title) succeeds", (input) => {
    expect(validateEntityType(input)).toEqual({ type: "Ok", inner: null });
  });

  test.each(invalidEntityTypes)(
    "validateEntityType returns errors on: %s",
    (_, input, expected) => {
      expect(validateEntityType(input)).toEqual({
        type: "Err",
        inner: expected,
      });
    },
  );

  test.each(brokenTypes)(
    "validateEntityType cleanly returns errors on different type: %s",
    (input, expected) => {
      expect(validateEntityType(input)).toEqual({
        type: "Err",
        inner: expected,
      });
    },
  );
});
