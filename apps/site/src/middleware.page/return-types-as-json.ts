/* istanbul ignore file */
import {
  DataType,
  EntityType,
  PropertyType,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ApiEntityTypeByUrlResponse } from "../pages/api/types/entity-type/get.api";
import { ApiPropertyTypeByUrlResponse } from "../pages/api/types/property-type/get.api";
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

const getTypeByVersionedUrl = (
  versionedUrl: VersionedUrl,
  kind: "entity-type" | "property-type",
) => {
  const origin = new URL(versionedUrl).origin;
  return fetch(
    `${origin}/api/types/${kind}/get?versionedUrl=${versionedUrl}`,
  ).then(
    (resp) =>
      resp.json() as Promise<
        ApiPropertyTypeByUrlResponse | ApiEntityTypeByUrlResponse
      >,
  );
};

export const returnTypeAsJson = async (request: NextRequest) => {
  const { url } = request;

  const isUrlValid = isValidBlockProtocolVersionedUrl(url);

  if (!isUrlValid) {
    return generateErrorResponse(
      400,
      "Malformed URL - expected to be in format @[workspace]/types/(entity-type|data-type|property-type)/[slug]/v/[version]",
    );
  }

  const origin = new URL(url).origin;

  const productionUrl = url.replace(origin, "https://blockprotocol.org");

  const kind = new URL(url).pathname.match(versionedTypeUrlRegExp)?.[1];

  let type: DataType | PropertyType | EntityType | null =
    hardcodedTypes[productionUrl as keyof typeof hardcodedTypes];

  // Our hardcoded types have ALL data types and a single entity-type
  // If it's not in there, it'll be an entity or property type
  if (!type && kind !== "data-type") {
    type = await getTypeByVersionedUrl(
      url,
      kind as "entity-type" | "property-type",
    ).then((apiResponse) => {
      if ("errors" in apiResponse) {
        return null;
      }
      return "propertyType" in apiResponse
        ? apiResponse.propertyType.schema
        : apiResponse.entityType.schema;
    });
  }

  if (!type) {
    return generateErrorResponse(
      404,
      "Type not found - please check the URL and try again",
    );
  }

  // @todo remove this cast when new type hosting available
  return generateJsonResponse(type as DataType | EntityType | PropertyType);
};
