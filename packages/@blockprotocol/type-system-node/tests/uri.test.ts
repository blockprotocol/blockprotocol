import { isValidVersionedUri, parseBaseUri } from "..";

describe("parseBaseUri", () => {
  test.each([
    ["http://example.com/", "http://example.com/"],
    ["http://example.com", "http://example.com/"],
    ["file://localhost/documents/myfolder", "file:///documents/myfolder"],
    ["file://localhost/documents/myfolder", "file:///documents/myfolder"],
    ["ftp://rms@example.com", "ftp://rms@example.com/"],
    ["https://////example.com///", "https://example.com///"],
    ["file://loc%61lhost/", "file:///"],
  ])("`parseBaseUri(%s)` succeeds", (input, expected) => {
    expect(parseBaseUri(input)).toBe(expected);
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
      const _ = parseBaseUri(input);
    }).toThrow();
  });
});

describe("isValidVersionedUri", () => {
  test.each([
    ["http://example.com/v/0"],
    ["http://example.com/v/1"],
    ["http://example.com/v/20"],
  ])("`isValidVersionedUri(%i)` succeeds", (input) => {
    isValidVersionedUri(input);
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
      isValidVersionedUri(input);
    }).toThrow();
  });
});
