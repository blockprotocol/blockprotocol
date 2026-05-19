/* istanbul ignore file */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type {
  DataType,
  EntityType,
  PropertyType,
  VersionedUrl,
} from "../lib/bp-types";
import { hardcodedTypes } from "./hardcoded-types";

const generateErrorResponse = (
  status: 400 | 401 | 404 | 500 | 501,
  message: string,
) =>
  new NextResponse(
    JSON.stringify({
      error: message,
    }),
    { status, headers: { "content-type": "application/json" } },
  );

const generateJsonResponse = (object: DataType | EntityType | PropertyType) =>
  new NextResponse(JSON.stringify(object, undefined, 2), {
    headers: { "content-type": "application/json" },
  });

export const versionedTypeUrlRegExp =
  /^\/@.+\/types\/(entity-type|data-type|property-type)\/.+\/v\/\d+$/;

const isValidBlockProtocolVersionedUrl = (url: string): url is VersionedUrl =>
  !!new URL(url).pathname.match(versionedTypeUrlRegExp);

/**
 * Serves Block Protocol types as JSON.
 *
 * The Hub used to host user-published entity/property types in MongoDB and
 * proxied them through this middleware. With Mongo removed, only the
 * hardcoded BP core types defined in {@link hardcodedTypes} are served;
 * any other type URL responds 404.
 */
export const returnTypeAsJson = async (request: NextRequest) => {
  const { url } = request;

  if (!isValidBlockProtocolVersionedUrl(url)) {
    return generateErrorResponse(
      400,
      "Malformed URL - expected to be in format @[workspace]/types/(entity-type|data-type|property-type)/[slug]/v/[version]",
    );
  }

  const origin = new URL(url).origin;
  const productionUrl = url.replace(origin, "https://blockprotocol.org");

  const type =
    hardcodedTypes[productionUrl as keyof typeof hardcodedTypes] ?? null;

  if (!type) {
    return generateErrorResponse(
      404,
      "Type not found - user-published type hosting is paused while we focus on HASH.",
    );
  }

  return generateJsonResponse(type as DataType | EntityType | PropertyType);
};
