import { EmbedderServiceMessageCallbacks } from "@blockprotocol/service";
import axios from "axios";

const bpSiteHost = `${
  process.env.BLOCK_PROTOCOL_SITE_HOST ?? "https://blockprotocol.org"
}/api`;

const externalApiHttpClient = axios.create({
  baseURL: bpSiteHost,
});

const callExternalApiMethod = async (params: {
  blockProtocolApiKey?: string;
  providerName: string;
  methodName: string;
  payload: any;
}): Promise<{ data: any }> => {
  const { providerName, methodName, payload, blockProtocolApiKey } = params;

  if (!blockProtocolApiKey) {
    throw new Error(
      `Visit ${bpSiteHost}/dashboard to generate a Block Protocol API key, which is required to make calls to the "${methodName}" method of the BP service module, and ensure it is passed to the \`MockBlockDock\` component as \`${blockProtocolApiKey}\`.`,
    );
  }

  const { data } = await externalApiHttpClient.post(
    "/external-service-method",
    { providerName, methodName, payload },
    { headers: { "x-api-key": blockProtocolApiKey } },
  );

  return { data: data.externalServiceMethodResponse };
};

export const constructServiceModuleCallbacks = (params: {
  blockProtocolApiKey?: string;
}): EmbedderServiceMessageCallbacks => {
  const { blockProtocolApiKey } = params;

  return {
    /** Mapbox Geocoding API */

    mapboxForwardGeocoding: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "forwardGeocoding",
        payload,
        blockProtocolApiKey,
      }),

    mapboxReverseGeocoding: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "reverseGeocoding",
        payload,
        blockProtocolApiKey,
      }),

    /** Mapbox Directions API */

    mapboxRetrieveDirections: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveDirections",
        payload,
        blockProtocolApiKey,
      }),

    /** Mapbox Isochrone API */

    mapboxRetrieveIsochrones: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveIsochrones",
        payload,
        blockProtocolApiKey,
      }),

    /** Mapbox Autofill API */

    mapboxSuggestAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "suggestAddress",
        payload,
        blockProtocolApiKey,
      }),

    mapboxRetrieveAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveAddress",
        payload,
        blockProtocolApiKey,
      }),

    mapboxCanRetrieveAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "canRetrieveAddress",
        payload,
        blockProtocolApiKey,
      }),

    /** Mapbox Static Map API */

    mapboxRetrieveStaticMap: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveStaticMap",
        payload,
        blockProtocolApiKey,
      }),
  };
};
