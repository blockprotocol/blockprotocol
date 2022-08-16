import { BaseUri, VersionedUri } from "@blockprotocol/type-system-node";

describe("BaseURI Class", () => {
  const testBaseUri = (input: string, expected: string) => {
    const uri = new BaseUri(input);

    expect(uri.toString()).toBe(expected);
    expect(uri.toJSON()).toBe(expected);
  };

  test("succeeds on valid URIs", () => {
    testBaseUri("http://example.com/", "http://example.com/");
    testBaseUri("http://example.com", "http://example.com/");
    testBaseUri(
      "file://localhost/documents/myfile",
      "file:///documents/myfile",
    );
    testBaseUri(
      "file://localhost/documents/myfile",
      "file:///documents/myfile",
    );
    testBaseUri("ftp://rms@example.com", "ftp://rms@example.com/");
    testBaseUri("https://////example.com///", "https://example.com///");
    testBaseUri("file://loc%61lhost/", "file:///");
  });

  test("errors on invalid URIs", () => {
    expect(() => {
      new BaseUri("\\example\\..\\demo/.\\");
    }).toThrow();

    expect(() => {
      new BaseUri("https://ex ample.org/");
    }).toThrow();

    expect(() => {
      new BaseUri("example");
    }).toThrow();

    expect(() => {
      new BaseUri("https://example.com:demo");
    }).toThrow();

    expect(() => {
      new BaseUri("http://[www.example.com]/");
    }).toThrow();
  });
});

describe("VersionedUri Class", () => {
  const baseUri = new BaseUri("http://example.com/");

  const testVersionedUri = (version: number, expected: string) => {
    let uri = new VersionedUri(baseUri, version);

    expect(uri.toString()).toBe(expected);
    expect(uri.toJSON()).toBe(expected);
  };

  test("succeeds on valid version number", () => {
    testVersionedUri(0, "http://example.com//v/0"); // TODO - fix this
    testVersionedUri(1, "http://example.com//v/1");
    testVersionedUri(20.0, "http://example.com//v/20");
    testVersionedUri(0.2, "http://example.com//v/20");
  });

  test("errors on invalid URIs", () => {
    expect(() => {
      new VersionedUri(baseUri, 0.2);
    }).toThrow();
  });
});
