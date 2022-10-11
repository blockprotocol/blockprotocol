import test from "ava";

import {
  ParsePropertyTypeError,
  PropertyType,
  validatePropertyType,
} from "../dist";
import { truncate } from "./shared/truncate";

const propertyTypes: PropertyType[] = [
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/age/v/1",
    title: "Age",
    pluralTitle: "Ages",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/contact-information/v/1",
    title: "Contact Information",
    pluralTitle: "Contact Information",
    oneOf: [
      {
        type: "object",
        properties: {
          "https://blockprotocol.org/@blockprotocol/types/property-type/email/":
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/email/v/1",
            },
          "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number/":
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/phone-number/v/1",
            },
        },
        required: [
          "https://blockprotocol.org/@blockprotocol/types/property-type/email/",
        ],
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/contrived-property/v/1",
    title: "Contrived Property",
    pluralTitle: "Contrived Properties",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
      },
      {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
            },
          ],
        },
        maxItems: 4,
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/favorite-quote/v/1",
    title: "Favorite Quote",
    pluralTitle: "Favorite Quotes",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/interests/v/1",
    title: "Interests",
    pluralTitle: "Interests",
    oneOf: [
      {
        type: "object",
        properties: {
          "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film/":
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-film/v/1",
            },
          "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song/":
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/favorite-song/v/1",
            },
          "https://blockprotocol.org/@blockprotocol/types/property-type/hobby/":
            {
              type: "array",
              items: {
                $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/hobby/v/1",
              },
            },
        },
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/name/v/1",
    title: "Name",
    pluralTitle: "Names",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/numbers/v/1",
    title: "Numbers",
    pluralTitle: "Numbers",
    oneOf: [
      {
        type: "array",
        items: {
          oneOf: [
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
            },
          ],
        },
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/text/v/1",
    title: "Text",
    pluralTitle: "Text",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/user-id/v/1",
    title: "User ID",
    pluralTitle: "User IDs",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/user-id/v/2",
    title: "User ID (2)",
    pluralTitle: "User IDs (2)",
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
      },
    ],
  },
];

// These are data types which satisfy the TypeScript interface but are still invalid, and demonstrate the need for the
// validation method
const invalidPropertyTypes: [string, PropertyType, ParsePropertyTypeError][] = [
  [
    "empty one of",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
      pluralTitle: "Broken",
      oneOf: [],
    },
    {
      reason: "InvalidOneOf",
      inner: {
        reason: "ValidationError",
        inner: {
          type: "EmptyOneOf",
        },
      },
    },
  ],
  [
    "non-integer version",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1.4",
      title: "Broken",
      pluralTitle: "Broken",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        },
      ],
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
      kind: "propertyType",
      $id: "https://  /broken/v/1",
      title: "Broken",
      pluralTitle: "Broken",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        },
      ],
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
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
      pluralTitle: "Broken",
      oneOf: [
        {
          $ref: "im a broken ref haha /v/1",
        },
      ],
    },
    {
      reason: "InvalidOneOf",
      inner: {
        reason: "PropertyValuesError",
        inner: {
          reason: "InvalidDataTypeReference",
          inner: {
            reason: "InvalidBaseUri",
            inner: {
              reason: "UrlParseError",
              inner: "relative URL without a base",
            },
          },
        },
      },
    },
  ],
  [
    "invalid property type object",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
      pluralTitle: "Broken",
      oneOf: [
        {
          type: "object",
          properties: {
            "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1":
              {
                $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
              },
          },
        },
      ],
    },
    {
      reason: "InvalidOneOf",
      inner: {
        reason: "PropertyValuesError",
        inner: {
          reason: "InvalidPropertyTypeObject",
          inner: {
            reason: "InvalidPropertyKey",
            inner: {
              reason: "MissingTrailingSlash",
            },
          },
        },
      },
    },
  ],
];
// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenPropertyTypes: [any, ParsePropertyTypeError][] = [
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
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/age/v/1",
      title: "Age",
    },
    {
      reason: "InvalidJson",
      inner: "missing field `pluralTitle` at line 1 column 114",
    },
  ],
];

for (const propertyType of propertyTypes) {
  test(`validatePropertyType(${propertyType.title}) succeeds`, (t) => {
    t.deepEqual(validatePropertyType(propertyType), {
      type: "Ok",
      inner: null,
    });
  });
}

for (const [
  description,
  invalidPropertyType,
  expected,
] of invalidPropertyTypes) {
  test(`validatePropertyType returns errors on: ${description}`, (t) => {
    t.deepEqual(validatePropertyType(invalidPropertyType), {
      type: "Err",
      inner: expected,
    });
  });
}

for (const [brokenPropertyType, expected] of brokenPropertyTypes) {
  test(`validatePropertyType returns errors on broken type: ${truncate(
    brokenPropertyType,
  )}`, (t) => {
    t.deepEqual(validatePropertyType(brokenPropertyType), {
      type: "Err",
      inner: expected,
    });
  });
}
