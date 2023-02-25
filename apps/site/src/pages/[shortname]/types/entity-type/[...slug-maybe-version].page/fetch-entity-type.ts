import {
  extractBaseUrl,
  validateVersionedUrl,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";

import { apiClient } from "../../../../../lib/api-client";

export const fetchEntityType = async (requestedUrl: string) => {
  const isVersionedUrl = validateVersionedUrl(requestedUrl).type === "Ok";

  const baseUrl = isVersionedUrl
    ? extractBaseUrl(requestedUrl as VersionedUrl)
    : requestedUrl.endsWith("/")
    ? requestedUrl
    : `${requestedUrl}/`;

  const requestedVersionPromise = apiClient
    .getEntityTypeByUrl(
      isVersionedUrl
        ? { versionedUrl: requestedUrl as VersionedUrl }
        : {
            baseUrl,
          },
    )
    .then(({ data }) => data?.entityType);

  const latestVersionPromise = isVersionedUrl
    ? apiClient
        .getEntityTypeByUrl({
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
