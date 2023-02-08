import { writeFileSync } from "node:fs";
/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from "node:path";

import { generateSchema, getProgramFromFiles } from "typescript-json-schema";

export type ServiceJsonMessage = {
  messageName: string;
  description: string;
  source: "block" | "embedder";
  respondedToBy: string | null;
  sentOnInitialization: boolean;
  data: any;
  errorCodes: string[];
};

const program = getProgramFromFiles([resolve("./src/types.ts")]);

const generateExternalApiSchema = (params: { typeName: string }) => {
  const schema = generateSchema(program, params.typeName, {
    required: true,
    ref: false,
  });

  if (!schema) {
    throw new Error(
      `The JSON Schema for the "${params.typeName}" TS type could not be generated.`,
    );
  }

  return schema;
};

export const mapboxMessages: ServiceJsonMessage[] = [
  /** Mapbox Geocoding API */
  {
    messageName: "mapbox.forwardGeocoding",
    description: "Forward geocoding request",
    source: "block",
    respondedToBy: "mapbox.forwardGeocodingResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxForwardGeocodingData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.forwardGeocodingResponse",
    description: "Response to a forward geocoding request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxForwardGeocodingResponseData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.reverseGeocoding",
    description: "Reverse geocoding request",
    source: "block",
    respondedToBy: "mapbox.reverseGeocodingResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxReverseGeocodingData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.reverseGeocodingResponse",
    description: "The response to a request geocoding request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxReverseGeocodingResponseData",
    }),
    errorCodes: [],
  },
  /** Mapbox Directions API */
  {
    messageName: "mapbox.retrieveDirections",
    description: "Retrieve directions request",
    source: "block",
    respondedToBy: "mapbox.retrieveDirectionsResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveDirectionsData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.retrieveRetrieveDirectionsResponse",
    description: "The response to a retrieve directions request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveDirectionsResponseData",
    }),
    errorCodes: [],
  },
  /** Mapbox Isochrone API */
  {
    messageName: "mapbox.retrieveIsochrones",
    description: "Retrieve isochrones",
    source: "block",
    respondedToBy: "mapbox.retrieveIsochronesResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveIsochronesData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.retrieveIsochronesResponse",
    description: "The response to a retrieve isochrones request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveIsochronesResponseData",
    }),
    errorCodes: [],
  },
  /** Autofill API */
  {
    messageName: "mapbox.suggestAddress",
    description: "Suggest an address",
    source: "block",
    respondedToBy: "mapbox.suggestAddressResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({ typeName: "MapboxSuggestAddressData" }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.suggestAddressResponse",
    description: "The response to a request to suggest an address",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxSuggestAddressResponseData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.retrieveAddress",
    description: "Retrieve an address",
    source: "block",
    respondedToBy: "mapbox.retrieveAddressResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveAddressData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.retrieveAddressResponse",
    description: "The response to a retrieve an address",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveAddressResponseData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.canRetrieveAddress",
    description: "Whether an address can be retrieved",
    source: "block",
    respondedToBy: "mapbox.canRetrieveAddressResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxCanRetrieveAddressData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.canRetrieveAddressResponse",
    description: "The response to a can retrieve an address request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxCanRetrieveAddressResponseData",
    }),
    errorCodes: [],
  },
  /** Static Image API */
  {
    messageName: "mapbox.retrieveStaticMap",
    description: "Retrieve a static map",
    source: "block",
    respondedToBy: "mapbox.retrieveStaticMapResponse",
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveStaticMapData",
    }),
    errorCodes: [],
  },
  {
    messageName: "mapbox.retrieveStaticMapResponse",
    description: "The response to a retrieve static map request",
    source: "embedder",
    respondedToBy: null,
    sentOnInitialization: false,
    data: generateExternalApiSchema({
      typeName: "MapboxRetrieveStaticMapResponseData",
    }),
    errorCodes: [],
  },
];

const serviceDefinition = {
  name: "external-api",
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
  "./src/external-api-service.json",
  JSON.stringify(serviceDefinition, null, 2),
);
