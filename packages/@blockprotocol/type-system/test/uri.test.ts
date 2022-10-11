import {
  BaseUri,
  extractBaseUri,
  extractVersion,
  ParseBaseUriError,
  ParseVersionedUriError,
  validateBaseUri,
  validateVersionedUri,
  VersionedUri,
} from "@blockprotocol/type-system";
import test from "ava";

const validateBaseUris: string[] = [
  "http://example.com/",
  "file://localhost/documents/myfolder/",
  "ftp://rms@example.com/",
  "https://////example.com///",
  "file://loc%61lhost/",
];

for (const validBaseUri of validateBaseUris) {
  test(`validateBaseUri("${validBaseUri}") succeeds`, (t) => {
    t.deepEqual(validateBaseUri(validBaseUri), {
      type: "Ok",
      inner: validBaseUri,
    });
  });
}

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

for (const [invalidBaseUri, error] of invalidBaseUriCases) {
  test(`validateBaseUri("${invalidBaseUri}") errors`, (t) => {
    t.deepEqual(validateBaseUri(invalidBaseUri), { type: "Err", inner: error });
  });
}

const validVersionedUris = [
  "http://example.com/v/0",
  "http://example.com/v/1",
  "http://example.com/v/20",
];

for (const validVersionedUri of validVersionedUris) {
  test(`validateVersionedUri("${validVersionedUri}") succeeds`, (t) => {
    t.deepEqual(validateVersionedUri(validVersionedUri), {
      type: "Ok",
      inner: validVersionedUri,
    });
  });
}

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

for (const [invalidVersionedUri, error] of invalidVersionedUriCases) {
  test(`validateVersionedUri("${invalidVersionedUri}") errors`, (t) => {
    t.deepEqual(validateVersionedUri(invalidVersionedUri), {
      type: "Err",
      inner: error,
    });
  });
}

const extractBaseUriCases: [VersionedUri, BaseUri][] = [
  ["http://example.com/v/0", "http://example.com/"],
  ["http://example.com/sandwich/v/1", "http://example.com/sandwich/"],
  [
    "file://localhost/documents/myfolder/v/10",
    "file://localhost/documents/myfolder/",
  ],
  ["ftp://rms@example.com/foo/v/5", "ftp://rms@example.com/foo/"],
];

for (const [versionedUri, baseUri] of extractBaseUriCases) {
  test(`extractBaseUri("${versionedUri}") succeeds`, (t) => {
    t.is(extractBaseUri(versionedUri), baseUri);
  });
}

const extractVersionCases: [VersionedUri, number][] = [
  ["http://example.com/v/0", 0],
  ["http://example.com/sandwich/v/1", 1],
  ["file://localhost/documents/myfolder/v/10", 10],
  ["ftp://rms@example.com/foo/v/5", 5],
];

for (const [versionedUri, version] of extractVersionCases) {
  test(`extractVersion("${versionedUri}") succeeds`, (t) => {
    t.is(extractVersion(versionedUri), version);
  });
}
