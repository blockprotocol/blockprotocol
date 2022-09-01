import { LinkType, ParseLinkTypeError, validateLinkType } from "..";

const linkTypes: LinkType[] = [
  {
    kind: "linkType",
    $id: "https://blockprotocol.org/@alice/types/link-type/acquaintance-of/v/1",
    title: "Acquaintance Of",
    pluralTitle: "Acquaintances Of",
    description: "Someone who is known but not a close friend",
    relatedKeywords: [],
  },
  {
    kind: "linkType",
    $id: "https://blockprotocol.org/@alice/types/link-type/owns/v/2",
    title: "Owns",
    pluralTitle: "Owns",
    description: "Have (something) as one's own; possess",
    relatedKeywords: ["has", "have", "possess", "own"],
  },
  {
    kind: "linkType",
    $id: "https://blockprotocol.org/@alice/types/link-type/submitted-by/v/1",
    title: "Submitted By",
    pluralTitle: "Submitted By",
    description: "Suggested, proposed, or presented by",
  },
];

// These are data types which satisfy the TypeScript interface but are still invalid, and demonstrate the need for the
// validation method
const invalidLinkTypes: [string, LinkType, ParseLinkTypeError][] = [
  [
    "non-integer version",
    {
      kind: "linkType",
      $id: "https://blockprotocol.org/@alice/types/link-type/broken/v/1.4",
      title: "Broken",
      pluralTitle: "Broken",
      description: "An invalid type",
      relatedKeywords: [],
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
      kind: "linkType",
      $id: "https://  /broken/v/1",
      title: "Broken",
      pluralTitle: "Broken",
      description: "An invalid type",
      relatedKeywords: [],
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
];
// Quick sanity check that passing in a completely different object also throws an error cleanly, this shouldn't be
// normally possible if we don't do something silly like the use of any below. This sanity check is important because
// it is possible for wasm to error in unusual ways that can't easily be handled, and that should be viewed as a bug.
const brokenTypes: [any, ParseLinkTypeError][] = [
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
      kind: "linkType",
      $id: "https://blockprotocol.org/@blockprotocol/types/link-type/owns/v/1",
      title: "Owns",
    },
    {
      reason: "InvalidJson",
      inner: "missing field `pluralTitle` at line 1 column 108",
    },
  ],
];

describe("validateLinkType", () => {
  test.each(linkTypes)("validateLinkType($title) succeeds", (input) => {
    expect(validateLinkType(input)).toEqual({ type: "Ok", inner: null });
  });

  test.each(invalidLinkTypes)(
    "validateLinkType returns errors on: %s",
    (_, input, expected) => {
      expect(validateLinkType(input)).toEqual({
        type: "Err",
        inner: expected,
      });
    },
  );

  test.each(brokenTypes)(
    "validateLinkType cleanly returns errors on different type: %s",
    (input, expected) => {
      expect(validateLinkType(input)).toEqual({
        type: "Err",
        inner: expected,
      });
    },
  );
});
