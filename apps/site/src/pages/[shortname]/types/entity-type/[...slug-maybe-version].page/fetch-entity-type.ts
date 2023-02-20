import {
  extractBaseUri,
  validateVersionedUri,
  VersionedUri,
} from "@blockprotocol/type-system/slim";

import { apiClient } from "../../../../../lib/api-client";

export const fetchEntityType = async (requestedUri: string) => {
  const isVersionedUri = validateVersionedUri(requestedUri).type === "Ok";

  const baseUri = isVersionedUri
    ? extractBaseUri(requestedUri as VersionedUri)
    : requestedUri.endsWith("/")
    ? requestedUri
    : `${requestedUri}/`;

  const requestedVersionPromise = apiClient
    .getEntityTypeByUri(
      isVersionedUri
        ? { versionedUri: requestedUri }
        : {
            baseUri,
          },
    )
    .then(({ data }) => data?.entityType);

  const latestVersionPromise = isVersionedUri
    ? apiClient
        .getEntityTypeByUri({
          baseUri,
        })
        .then(({ data }) => data?.entityType)
    : // if we were given a non-versioned URI this will be getting the latest anyway
      requestedVersionPromise;

  const [requestedVersion, latestVersion] = await Promise.all([
    requestedVersionPromise,
    latestVersionPromise,
  ]);

  return [requestedVersion, latestVersion];
};
