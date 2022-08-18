import { BaseUri, VersionedUri } from "..";

describe("BaseURI Class", () => {
  test.each([
    ["http://example.com/", "http://example.com/"],
    ["http://example.com", "http://example.com/"],
    ["file://localhost/documents/myfile", "file:///documents/myfile"],
    ["file://localhost/documents/myfile", "file:///documents/myfile"],
    ["ftp://rms@example.com", "ftp://rms@example.com/"],
    ["https://////example.com///", "https://example.com///"],
    ["file://loc%61lhost/", "file:///"],
  ])("`new BaseUri(%s)` succeeds", (input, expected) => {
    const uri = new BaseUri(input);

    expect(uri.toString()).toBe(expected);
    expect(uri.toJSON()).toBe(expected);
  });

  test.each([
    "\\example\\..\\demo/.\\",
    "https://ex ample.org/",
    "example",
    "https://example.com:demo",
    "http://[www.example.com]/",
  ])("`new BaseUri(%s)` errors", (input) => {
    expect(() => {
      const _ = new BaseUri(input);
    }).toThrow();
  });
});

describe("VersionedUri Class", () => {
  const baseUri = new BaseUri("http://example.com/");

  test.each([
    [0, "http://example.com/v/0"],
    [1, "http://example.com/v/1"],
    [20.0, "http://example.com/v/20"],
  ])(
    '`new VersionedUri("http://example.com/", %i)` succeeds',
    (version, expected) => {
      const uri = new VersionedUri(baseUri, version);

      expect(uri.toString()).toBe(expected);
      expect(uri.toJSON()).toBe(expected);
    },
  );

  // @todo: this test ideally should fail, but currently the number is Math.floored into an integer silently
  test.skip("errors on invalid URIs", () => {
    expect(() => {
      const _ = new VersionedUri(baseUri, 0.2);
    }).toThrow();
  });
});
