import {
  extractBaseUrl,
  validateVersionedUrl,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";

import { apiClient } from "../../../../../lib/api-client";

export const fetchEntityType = async (requestedUri: string) => {
  const isVersionedUrl = validateVersionedUrl(requestedUri).type === "Ok";

  const baseUrl = isVersionedUrl
    ? extractBaseUrl(requestedUri as VersionedUrl)
    : requestedUri.endsWith("/")
    ? requestedUri
    : `${requestedUri}/`;

  const requestedVersionPromise = apiClient
    .getEntityTypeByUri(
      isVersionedUrl
        ? { versionedUrl: requestedUri }
        : {
            baseUrl,
          },
    )
    .then(({ data }) => data?.entityType);

  const latestVersionPromise = isVersionedUrl
    ? apiClient
        .getEntityTypeByUri({
          baseUrl,
        })
        .then(({ data }) => data?.entityType)
    : // if we were given a non-versioned URL this will be getting the latest anyway
      requestedVersionPromise;

  const [requestedVersion, latestVersion] = await Promise.all([
    requestedVersionPromise,
    latestVersionPromise,
  ]);

  return [requestedVersion, latestVersion];
};
