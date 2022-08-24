import { isValidPropertyType, PropertyType } from "..";

const propertyTypes: PropertyType[] = [
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/age/v/1",
    title: "Age",
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
    oneOf: [
      {
        $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/text/v/1",
      },
    ],
  },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@alice/types/property-type/user-id/v/2",
    title: "User ID",
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
const invalidPropertyTypes: [string, PropertyType][] = [
  [
    "empty one of",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
      oneOf: [],
    },
  ],
  [
    "non-integer version",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1.4",
      title: "Broken",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        },
      ],
    },
  ],
  [
    "invalid base URI",
    {
      kind: "propertyType",
      $id: "https://  /broken/v/1",
      title: "Broken",
      oneOf: [
        {
          $ref: "https://blockprotocol.org/@blockprotocol/types/data-type/number/v/1",
        },
      ],
    },
  ],
  [
    "invalid ref",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
      oneOf: [
        {
          $ref: "im a broken ref haha /v/1",
        },
      ],
    },
  ],
  [
    "invalid property type object",
    {
      kind: "propertyType",
      $id: "https://blockprotocol.org/@blockprotocol/types/property-type/broken/v/1",
      title: "Broken",
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
  ],
];
// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenTypes: any[] = [
  {},
  { foo: "bar" },
  {
    kind: "propertyType",
    $id: "https://blockprotocol.org/@blockprotocol/types/property-type/age/v/1",
    title: "Age",
  },
];

describe("isValidPropertyType", () => {
  test.each(propertyTypes)("isValidPropertyType($title) succeeds", (input) => {
    expect(() => isValidPropertyType(input)).not.toThrow();
  });

  test.each(invalidPropertyTypes)(
    "isValidPropertyType errors on: %s",
    (_, input) => {
      expect(() => isValidPropertyType(input)).toThrow();
    },
  );

  test.each(brokenTypes)(
    "isValidPropertyType cleanly errors on different type: %s",
    (input) => {
      expect(() => isValidPropertyType(input)).toThrow();
    },
  );
});
