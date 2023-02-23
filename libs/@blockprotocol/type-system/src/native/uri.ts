import {
  BaseUrl,
  ParseBaseUrlError,
  ParseVersionedUrlError,
  Result,
  VersionedUrl,
} from "../../wasm/type-system";

/**
 * Checks if a given URL string is a valid base URL.
 *
 * @param {BaseUrl} uri - The URL string.
 * @returns {(Result<BaseUrl, ParseBaseUrlError>)} - an Ok with an inner of the string as a
 * BaseUrl if valid, or an Err with an inner ParseBaseUrlError
 */
export const validateBaseUrl = (
  uri: string,
): Result<BaseUrl, ParseBaseUrlError> => {
  try {
    void new URL(uri);
    if (uri.endsWith("/")) {
      return {
        type: "Ok",
        inner: uri as BaseUrl,
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

const versionedUrlRegExp = /(.+\/)v\/(\d+)(.*)/;

/**
 * Checks if a given URL string is a Block Protocol compliant Versioned URL.
 *
 * @param {string} uri - The URL string.
 * @returns {(Result<VersionedUrl, ParseVersionedUrlError>)} - an Ok with an inner of the string
 as
 * a VersionedUrl if valid, or an Err with an inner ParseVersionedUrlError
 */
export const validateVersionedUrl = (
  uri: string,
): Result<VersionedUrl, ParseVersionedUrlError> => {
  const groups = versionedUrlRegExp.exec(uri);

  if (groups === null) {
    return {
      type: "Err",
      inner: { reason: "IncorrectFormatting" },
    };
  } else {
    const [_match, baseUrl, version, trailingContent] = groups;

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

    if (!baseUrl) {
      return {
        type: "Err",
        inner: { reason: "MissingBaseUrl" },
      };
    }

    const validBaseUrlResult = validateBaseUrl(baseUrl);

    if (validBaseUrlResult.type === "Err") {
      return {
        type: "Err",
        inner: { reason: "InvalidBaseUrl", inner: validBaseUrlResult.inner },
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

    return { type: "Ok", inner: uri as VersionedUrl };
  }
};

/**
 * Extracts the base URL from a Versioned URL.
 *
 * @param {VersionedUrl} uri - The versioned URL.
 * @throws if the versioned URL is invalid.
 */
export const extractBaseUrl = (uri: VersionedUrl): BaseUrl => {
  const groups = versionedUrlRegExp.exec(uri);

  if (groups === null) {
    throw new Error(`Not a valid VersionedUrl: ${uri}`);
  }

  const [_match, baseUrl, _version] = groups;

  if (baseUrl === undefined) {
    throw new Error(`Not a valid VersionedUrl: ${uri}`);
  }

  return baseUrl;
};

/**
 * Extracts the version from a Versioned URL.
 *
 * @param {VersionedUrl} uri - The versioned URL.
 * @throws if the versioned URL is invalid.
 */
export const extractVersion = (uri: VersionedUrl): number => {
  const groups = versionedUrlRegExp.exec(uri);

  if (groups === null) {
    throw new Error(`Not a valid VersionedUrl: ${uri}`);
  }

  const [_match, _baseUrl, version] = groups;

  return Number(version);
};
