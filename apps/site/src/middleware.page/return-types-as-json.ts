/* istanbul ignore file */
import {
  DataType,
  EntityType,
  PropertyType,
  VersionedUri,
} from "@blockprotocol/type-system/slim";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hardcodedTypes } from "./return-types-as-json/hardcoded-types";

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

export const versionedTypeUriRegExp =
  /types\/(entity-type|data-type|property-type)\/.+\/v\/\d+$/;

const validateVersionedUri = (uri: string): uri is VersionedUri =>
  !!uri.match(versionedTypeUriRegExp);

export const returnTypeAsJson = async (request: NextRequest) => {
  const { url } = request;

  const isUriValid = validateVersionedUri(url);

  if (!isUriValid) {
    return generateErrorResponse(
      400,
      "Malformed URL - expected to be in format @[workspace]/types/(entity-type|data-type|property-type)/[slug]/v/[version]",
    );
  }

  const origin = new URL(url).origin;

  const productionUrl = url.replace(origin, "https://blockprotocol.org");

  const type = hardcodedTypes[productionUrl as keyof typeof hardcodedTypes];

  // @todo implement fetching of entity and property types from the db when new type hosting available

  if (!type) {
    return generateErrorResponse(
      404,
      "Type not found - please check the URL and try again",
    );
  }

  // @todo remove this cast when new type hosting available
  return generateJsonResponse(type as DataType | EntityType | PropertyType);
};
