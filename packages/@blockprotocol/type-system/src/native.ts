import {
  BaseUri,
  ParseBaseUriError,
  ParseVersionedUriError,
  Result,
  VersionedUri,
} from "../wasm/type-system";

/**
 * Checks if a given URL string is a valid base URL.
 *
 * @param {BaseUri} uri - The URL string.
 * @returns {(Result<BaseUri, ParseBaseUriError>)} - an Ok with an inner of the string as a
 * BaseUri if valid, or an Err with an inner ParseBaseUriError
 */
export const validateBaseUri = (
  uri: string,
): Result<BaseUri, ParseBaseUriError> => {
  try {
    void new URL(uri);
    if (uri.endsWith("/")) {
      return {
        type: "Ok",
        inner: uri as BaseUri,
      };
    } else {
      return {
        type: "Err",
        inner: { reason: "MissingTrailingSlash" },
      };
    }
  } catch (err) {
    return {
      type: "Err",
      inner: { reason: "UrlParseError", inner: JSON.stringify(err) },
    };
  }
};

const versionedUriRegExp = /(.+\/)v\/(\d+)(.*)/;

/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URI.
 *
 * @param {string} uri - The URL string.
 * @returns {(Result<VersionedUri, ParseVersionedUriError>)} - an Ok with an inner of the string
   as
 * a VersionedUri if valid, or an Err with an inner ParseVersionedUriError
 */
export const validateVersionedUri = (
  uri: string,
): Result<VersionedUri, ParseVersionedUriError> => {
  const groups = versionedUriRegExp.exec(uri);

  if (groups === null) {
    return {
      type: "Err",
      inner: { reason: "IncorrectFormatting" },
    };
  } else {
    const [_match, baseUri, version, trailingContent] = groups;

    if (trailingContent) {
      return {
        type: "Err",
        inner: { reason: "AdditionalEndContent" },
      };
    }

    if (!version) {
      return {
        type: "Err",
        inner: { reason: "MissingVersion" },
      };
    }

    if (!baseUri) {
      return {
        type: "Err",
        inner: { reason: "MissingBaseUri" },
      };
    }

    const validBaseUriResult = validateBaseUri(baseUri);

    if (validBaseUriResult.type === "Err") {
      return {
        type: "Err",
        inner: { reason: "InvalidBaseUri", inner: validBaseUriResult.inner },
      };
    }

    const versionNumber = Number(version);

    if (!Number.isInteger(versionNumber) || versionNumber < 0) {
      return {
        type: "Err",
        inner: {
          reason: "InvalidVersion",
          inner: `\`${version}\` is not a valid non-negative integer`,
        },
      };
    }

    return { type: "Ok", inner: uri as VersionedUri };
  }
};

/**
 * Extracts the base URI from a Versioned URI.
 *
 * @param {VersionedUri} uri - The versioned URI.
 * @throws if the versioned URI is invalid.
 */
export const extractBaseUri = (uri: VersionedUri): BaseUri => {
  const groups = versionedUriRegExp.exec(uri);

  if (groups === null) {
    throw new Error(`Not a valid VersionedUri: ${uri}`);
  }

  const [_match, baseUri, _version] = groups;

  if (baseUri === undefined) {
    throw new Error(`Not a valid VersionedUri: ${uri}`);
  }

  return baseUri;
};

/**
 * Extracts the version from a Versioned URI.
 *
 * @param {VersionedUri} uri - The versioned URI.
 * @throws if the versioned URI is invalid.
 */
export const extractVersion = (uri: VersionedUri): number => {
  const groups = versionedUriRegExp.exec(uri);

  if (groups === null) {
    throw new Error(`Not a valid VersionedUri: ${uri}`);
  }

  const [_match, _baseUri, version] = groups;

  return Number(version);
};
