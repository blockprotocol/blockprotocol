import {
  extractBaseUri,
  extractVersion,
  isValidBaseUri,
  isVersionedUri,
} from "..";

describe("parseBaseUri", () => {
  test.each([
    ["http://example.com/"],
    ["file://localhost/documents/myfolder/"],
    ["ftp://rms@example.com/"],
    ["https://////example.com///"],
    ["file://loc%61lhost/"],
  ])("`parseBaseUri(%s)` succeeds", (input) => {
    expect(() => isValidBaseUri(input)).not.toThrow();
  });

  test.each([
    "\\example\\..\\demo/.\\",
    "https://ex ample.org/",
    "example",
    "https://example.com:demo",
    "http://[www.example.com]/",
    "data:text/plain,Hello?World#",
  ])("`parseBaseUri(%s)` errors", (input) => {
    expect(() => {
      isValidBaseUri(input);
    }).toThrow();
  });
});

describe("isValidVersionedUri", () => {
  test.each([
    ["http://example.com/v/0"],
    ["http://example.com/v/1"],
    ["http://example.com/v/20"],
  ])("`isValidVersionedUri(%s)` succeeds", (input) => {
    expect(isVersionedUri(input)).toBe(true);
  });

  test.each([
    ["http://example.com"],
    ["http://example.com/v/"],
    ["http://example.com/v/0.2"],
    ["http://example.com/v//20"],
    ["http://example.com/v/30/1"],
    ["http://example.com/v/foo"],
  ])("isValidVersionedUri(%s) errors", (input) => {
    expect(() => {
      isVersionedUri(input);
    }).toThrow();
  });
});

describe("extractBaseUri", () => {
  test.each([
    ["http://example.com/v/0", "http://example.com/"],
    ["http://example.com/sandwich/v/1", "http://example.com/sandwich/"],
    [
      "file://localhost/documents/myfolder/v/10",
      "file://localhost/documents/myfolder/",
    ],
    ["ftp://rms@example.com/foo/v/5", "ftp://rms@example.com/foo/"],
  ])("`extractBaseUri(%s)` succeeds", (input, expected) => {
    if (isVersionedUri(input)) {
      expect(extractBaseUri(input)).toBe(expected);
    }
  });
});

describe("extractVersion", () => {
  test.each([
    ["http://example.com/v/0", 0],
    ["http://example.com/sandwich/v/1", 1],
    ["file://localhost/documents/myfolder/v/10", 10],
    ["ftp://rms@example.com/foo/v/5", 5],
  ])("`extractVersion(%s)` succeeds", (input, expected) => {
    if (isVersionedUri(input)) {
      expect(extractVersion(input)).toBe(expected);
    }
  });
});
