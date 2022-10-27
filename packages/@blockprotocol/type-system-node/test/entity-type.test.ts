import { EntityType, ParseEntityTypeError, validateEntityType } from "..";

const entityTypes: EntityType[] = [
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
    type: "object",
    title: "UK Address",
    pluralTitle: "UK Addresses",
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
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/block/v/1",
    title: "Block",
    pluralTitle: "Blocks",
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
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/book/v/1",
    title: "Book",
    pluralTitle: "Books",
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
      "https://blockprotocol.org/@alice/types/link-type/written-by/v/1": {
        oneOf: [
          {
            $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
          },
        ],
      },
    },
    requiredLinks: [
      "https://blockprotocol.org/@alice/types/link-type/written-by/v/1",
    ],
    examples: [],
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/building/v/1",
    type: "object",
    title: "Building",
    pluralTitle: "Buildings",
    properties: {},
    links: {
      "https://blockprotocol.org/@alice/types/link-type/located-at/v/1": {
        oneOf: [
          {
            $ref: "https://blockprotocol.org/@alice/types/entity-type/uk-address/v/1",
          },
        ],
      },
      "https://blockprotocol.org/@alice/types/link-type/tenant/v/1": {
        oneOf: [
          {
            $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
          },
        ],
      },
    },
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/organization/v/1",
    type: "object",
    title: "Organization",
    pluralTitle: "Organizations",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/organization/v/1",
    type: "object",
    title: "Organization",
    pluralTitle: "Organizations",
    allOf: [],
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/page/v/2",
    type: "object",
    title: "Page",
    pluralTitle: "Pages",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/text/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/text/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/link-type/written-by/v/1": {
        oneOf: [
          {
            $ref: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
          },
        ],
      },
      "https://blockprotocol.org/@alice/types/link-type/contains/v/1": {
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
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/person/v/1",
    type: "object",
    title: "Person",
    pluralTitle: "People",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/link-type/friend-of/v/1": {
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
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/playlist/v/1",
    type: "object",
    title: "Playlist",
    pluralTitle: "Playlists",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
    links: {
      "https://blockprotocol.org/@alice/types/link-type/contains/v/1": {
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
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/song/v/1",
    type: "object",
    title: "Song",
    pluralTitle: "Songs",
    properties: {
      "https://blockprotocol.org/@alice/types/property-type/name/": {
        $ref: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
      },
    },
  },
  {
    kind: "entityType",
    $id: "https://blockprotocol.org/@alice/types/entity-type/knows/v/1",
    type: "object",
    title: "Knows",
    pluralTitle: "Knows",
    allOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/relationship/v/1",
      },
    ],
    properties: {},
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/":
          {
            $ref: "im a broken ref haha /v/1",
          },
      },
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
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
      pluralTitle: "Broken",
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      links: {
        "https://blockprotocol.org/@alice/types/link-type/friend-of/v/1.3": {
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
      pluralTitle: "Broken",
      properties: {
        "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1":
          {
            $ref: "https://blockprotocol.org/@alice/types/property-type/address-line-1/v/1",
          },
      },
      links: {
        "https://blockprotocol.org/@alice/types/link-type/friend-of/v/1": {
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
      pluralTitle: "Broken",
      allOf: [
        {
          $ref: "https://blockprotocol.org/@alice/types/property-type/relationship/v/1.2",
        },
      ],
      properties: {},
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
      $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/broken/v/1",
      title: "Broken",
    },
    {
      reason: "InvalidJson",
      inner: "missing field `pluralTitle` at line 1 column 116",
    },
  ],
];

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
