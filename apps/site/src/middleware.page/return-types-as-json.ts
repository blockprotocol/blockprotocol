/* istanbul ignore file */
import {
  DataType,
  EntityType,
  PropertyType,
  VersionedUri,
} from "@blockprotocol/type-system/slim";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { FRONTEND_URL } from "../lib/config";
import { ApiEntityTypeByUriResponse } from "../pages/api/types/entity-type/get.api";
import { ApiPropertyTypeByUriResponse } from "../pages/api/types/property-type/get.api";
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

const getTypeByVersionedUri = (
  versionedUri: VersionedUri,
  kind: "entity-type" | "property-type",
) =>
  fetch(
    `${FRONTEND_URL}/api/types/${kind}/get?versionedUri=${versionedUri}`,
  ).then(
    (resp) =>
      resp.json() as Promise<
        ApiPropertyTypeByUriResponse | ApiEntityTypeByUriResponse
      >,
  );

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

  const kind = url.match(versionedTypeUriRegExp)?.[1];

  let type: DataType | PropertyType | EntityType =
    hardcodedTypes[productionUrl as keyof typeof hardcodedTypes];

  // Our hardcoded types have ALL data types and a single entity-type
  // If it's not in there, it'll be an entity or property type
  if (!type && kind !== "data-type") {
    type = await getTypeByVersionedUri(
      url,
      kind as "entity-type" | "property-type",
    ).then((apiResponse) => {
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

  return generateJsonResponse(type);
};
