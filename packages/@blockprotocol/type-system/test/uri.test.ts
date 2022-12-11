import {
  BaseUri,
  extractBaseUri,
  extractVersion,
  ParseBaseUriError,
  ParseVersionedUriError,
  TypeSystemInitializer,
  validateBaseUri,
  validateVersionedUri,
  VersionedUri,
} from "..";

/** @todo - update these tests */

const invalidBaseUriCases: [string, ParseBaseUriError][] = [
  ["http://example.com", { reason: "MissingTrailingSlash" }],
  [
    "\\example\\..\\demo/.\\/",
    { reason: "UrlParseError", inner: "relative URL without a base" },
  ],
  [
    "https://ex ample.org/",
    { reason: "UrlParseError", inner: "invalid domain character" },
  ],
  [
    "example/",
    { reason: "UrlParseError", inner: "relative URL without a base" },
  ],
  [
    "https://example.com:demo/",
    { reason: "UrlParseError", inner: "invalid port number" },
  ],
  [
    "http://[www.example.com]/",
    { reason: "UrlParseError", inner: "invalid IPv6 address" },
  ],
  ["data:text/plain,Hello?World#/", { reason: "CannotBeABase" }],
];

describe("validateBaseUri", () => {
  test.each([
    ["http://example.com/"],
    ["file://localhost/documents/myfolder/"],
    ["ftp://rms@example.com/"],
    ["https://////example.com///"],
    ["file://loc%61lhost/"],
  ])("`parseBaseUri(%s)` succeeds", (input) => {
    expect(validateBaseUri(input)).toEqual({ type: "Ok", inner: input });
  });

  test.each(invalidBaseUriCases)(
    "`parseBaseUri(%s)` errors",
    (input, expected) => {
      expect(validateBaseUri(input)).toEqual({ type: "Err", inner: expected });
    },
  );
});

const invalidVersionedUriCases: [string, ParseVersionedUriError][] = [
  [
    "example/v/2",
    {
      reason: "InvalidBaseUri",
      inner: { reason: "UrlParseError", inner: "relative URL without a base" },
    },
  ],
  ["http://example.com", { reason: "IncorrectFormatting" }],
  ["http://example.com/v/", { reason: "IncorrectFormatting" }],
  ["http://example.com/v/0.2", { reason: "AdditionalEndContent" }],
  ["http://example.com/v//20", { reason: "IncorrectFormatting" }],
  ["http://example.com/v/30/1", { reason: "AdditionalEndContent" }],
  ["http://example.com/v/foo", { reason: "IncorrectFormatting" }],
];

describe("validateVersionedUri", () => {
  test.each([
    ["http://example.com/v/0"],
    ["http://example.com/v/1"],
    ["http://example.com/v/20"],
  ])("`validateVersionedUri(%s)` succeeds", (input) => {
    expect(validateVersionedUri(input)).toEqual({ type: "Ok", inner: input });
  });

  test.each(invalidVersionedUriCases)(
    "validateVersionedUri(%s) returns errors",
    (input, expected) => {
      expect(validateVersionedUri(input)).toEqual({
        type: "Err",
        inner: expected,
      });
    },
  );
});

const extractBaseUriCases: [VersionedUri, BaseUri][] = [
  ["http://example.com/v/0", "http://example.com/"],
  ["http://example.com/sandwich/v/1", "http://example.com/sandwich/"],
  [
    "file://localhost/documents/myfolder/v/10",
    "file://localhost/documents/myfolder/",
  ],
  ["ftp://rms@example.com/foo/v/5", "ftp://rms@example.com/foo/"],
];

describe("extractBaseUri", () => {
  test.each(extractBaseUriCases)(
    "`extractBaseUri(%s)` succeeds",
    (input, expected) => {
      expect(extractBaseUri(input)).toEqual(expected);
    },
  );
});

const extractVersionCases: [VersionedUri, number][] = [
  ["http://example.com/v/0", 0],
  ["http://example.com/sandwich/v/1", 1],
  ["file://localhost/documents/myfolder/v/10", 10],
  ["ftp://rms@example.com/foo/v/5", 5],
];

beforeAll(async () => {
  await TypeSystemInitializer.initialize();
});

describe("extractVersion", () => {
  test.each(extractVersionCases)(
    "`extractVersion(%s)` succeeds",
    (input, expected) => {
      expect(extractVersion(input)).toEqual(expected);
    },
  );
});
