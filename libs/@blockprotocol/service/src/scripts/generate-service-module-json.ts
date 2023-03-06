import { writeFileSync } from "node:fs";
/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from "node:path";

import { JsonObject, ModuleMessageDefinition } from "@blockprotocol/core";
import { generateSchema, getProgramFromFiles } from "typescript-json-schema";

const program = getProgramFromFiles([resolve("./src/types.ts")]);

const generateServiceSchema = (params: { typeName: string }): JsonObject => {
  const schema = generateSchema(program, params.typeName, {
    required: true,
    ref: false,
  });

  if (!schema) {
    throw new Error(
      `The JSON Schema for the "${params.typeName}" TS type could not be generated.`,
    );
  }

  return schema as JsonObject;
};

const errorCodes = [
  "FORBIDDEN",
  "INTERNAL_ERROR",
  "INVALID_INPUT",
  "NOT_IMPLEMENTED",
  "TOO_MANY_REQUESTS",
  "UNAUTHORIZED",
];

export const mapboxMessages: ModuleMessageDefinition[] = [
  /** OpenAI */
  {
    messageName: "openaiCreateImage",
    description:
      "Create an image using OpenAI - see https://platform.openai.com/docs/api-reference/images",
    source: "block",
    respondedToBy: "openaiCreateImageResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "OpenAICreateImageData",
    }),
    errorCodes: [],
  },
  {
    messageName: "openaiCreateImageResponse",
    description: "Response to a create OpenAI image request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "OpenAICreateImageResponseData",
    }),
    errorCodes,
  },
  {
    messageName: "openaiCompleteText",
    description:
      "Complete text using OpenAI – see https://platform.openai.com/docs/api-reference/completions",
    source: "block",
    respondedToBy: "openaiCompleteTextResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "OpenAICompleteTextData",
    }),
    errorCodes: [],
  },
  {
    messageName: "openaiCompleteTextResponse",
    description: "Response to a OpenAI complete text request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "OpenAICompleteTextResponseData",
    }),
    errorCodes,
  },
  /** Mapbox Geocoding API */
  {
    messageName: "mapboxForwardGeocoding",
    description:
      "Forward geocoding request – see https://docs.mapbox.com/api/search/geocoding",
    source: "block",
    respondedToBy: "mapboxForwardGeocodingResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxForwardGeocodingData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxForwardGeocodingResponse",
    description: "Response to a forward geocoding request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxForwardGeocodingResponseData",
    }),
    errorCodes,
  },
  {
    messageName: "mapboxReverseGeocoding",
    description:
      "Reverse geocoding request – see https://docs.mapbox.com/api/search/geocoding",
    source: "block",
    respondedToBy: "mapboxReverseGeocodingResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxReverseGeocodingData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxReverseGeocodingResponse",
    description: "The response to a request geocoding request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxReverseGeocodingResponseData",
    }),
    errorCodes,
  },
  /** Mapbox Directions API */
  {
    messageName: "mapboxRetrieveDirections",
    description:
      "Retrieve directions request – see https://docs.mapbox.com/api/navigation/directions",
    source: "block",
    respondedToBy: "mapboxRetrieveDirectionsResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveDirectionsData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxRetrieveRetrieveDirectionsResponse",
    description: "The response to a retrieve directions request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveDirectionsResponseData",
    }),
    errorCodes,
  },
  /** Mapbox Isochrone API */
  {
    messageName: "mapboxRetrieveIsochrones",
    description:
      "Retrieve isochrones – see https://docs.mapbox.com/api/navigation/isochrone",
    source: "block",
    respondedToBy: "mapboxRetrieveIsochronesResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveIsochronesData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxRetrieveIsochronesResponse",
    description: "The response to a retrieve isochrones request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveIsochronesResponseData",
    }),
    errorCodes,
  },
  /** Autofill API */
  {
    messageName: "mapboxSuggestAddress",
    description:
      "Suggest an address – see https://docs.mapbox.com/api/search/search/#retrieve-a-suggestion",
    source: "block",
    respondedToBy: "mapboxSuggestAddressResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({ typeName: "MapboxSuggestAddressData" }),
    errorCodes: [],
  },
  {
    messageName: "mapboxSuggestAddressResponse",
    description: "The response to a request to suggest an address",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxSuggestAddressResponseData",
    }),
    errorCodes,
  },
  {
    messageName: "mapboxRetrieveAddress",
    description:
      "Retrieve an address - see https://docs.mapbox.com/api/search/search/#retrieve-a-suggested-feature",
    source: "block",
    respondedToBy: "mapboxRetrieveAddressResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveAddressData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxRetrieveAddressResponse",
    description: "The response to a retrieve an address",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveAddressResponseData",
    }),
    errorCodes,
  },
  {
    messageName: "mapboxCanRetrieveAddress",
    description: "Whether an address can be retrieved",
    source: "block",
    respondedToBy: "mapboxCanRetrieveAddressResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxCanRetrieveAddressData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxCanRetrieveAddressResponse",
    description: "The response to a can retrieve an address request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxCanRetrieveAddressResponseData",
    }),
    errorCodes,
  },
  /** Static Image API */
  {
    messageName: "mapboxRetrieveStaticMap",
    description:
      "Retrieve a static map – see https://docs.mapbox.com/api/maps/static-images",
    source: "block",
    respondedToBy: "mapboxRetrieveStaticMapResponse",
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveStaticMapData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapboxRetrieveStaticMapResponse",
    description: "The response to a retrieve static map request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateServiceSchema({
      typeName: "MapboxRetrieveStaticMapResponseData",
    }),
    errorCodes,
  },
];

const serviceDefinition = {
  name: "service",
  version: "0.1",
  coreVersion: "0.1",
  messages: [
    ...mapboxMessages,
    /**
     * @todo: add OpenAI message definitions
     * @see TODO
     */
  ],
};

writeFileSync(
  "./src/service-module.json",
  JSON.stringify(serviceDefinition, null, 2),
);
