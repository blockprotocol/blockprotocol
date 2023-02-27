import { EmbedderServiceMessageCallbacks } from "@blockprotocol/service";
import axios, { AxiosError } from "axios";

const externalApiHttpClient = axios.create();

const callExternalApiMethod = async (params: {
  blockProtocolApiKey?: string;
  blockProtocolSiteHost?: string;
  providerName: string;
  methodName: string;
  payload: any;
  // @todo better typings
}): Promise<{ data?: any; errors?: any }> => {
  const {
    providerName,
    methodName,
    payload,
    blockProtocolApiKey,
    blockProtocolSiteHost,
  } = params;

  const bpSiteHost = blockProtocolSiteHost ?? "https://blockprotocol.org";
  const baseUrl = `${bpSiteHost}/api`;

  if (!blockProtocolApiKey) {
    throw new Error(
      `Visit ${bpSiteHost}/dashboard to generate a Block Protocol API key, which is required to make calls to the "${methodName}" method of the BP service module, and ensure it is passed to the \`MockBlockDock\` component as blockProtocolApiKey.`,
    );
  }

  try {
    const { data } = await externalApiHttpClient.post(
      "/external-service-method",
      { providerName, methodName, payload },
      {
        headers: { "x-api-key": blockProtocolApiKey },
        baseURL: baseUrl,
      },
    );

    return { data: data.externalServiceMethodResponse };
  } catch (error) {
    const axiosError = error as AxiosError;

    const { status, data } = axiosError.response ?? {};

    return {
      errors: [
        {
          message:
            data && typeof data === "object" && "errors" in data
              ? (data.errors as any)?.[0]?.message
              : "An unknown error occurred.",
          code:
            status === 401 || status === 403 ? "FORBIDDEN" : "INTERNAL_ERROR",
        },
      ],
    };
  }
};

export const constructServiceModuleCallbacks = (params: {
  blockProtocolApiKey?: string;
  blockProtocolSiteHost?: string;
}): EmbedderServiceMessageCallbacks => {
  const { blockProtocolApiKey, blockProtocolSiteHost } = params;

  return {
    /** OpenAI */

    openaiCreateImage: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "openai",
        methodName: "createImage",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    openaiCompleteText: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "openai",
        methodName: "completeText",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    /** Mapbox Geocoding API */

    mapboxForwardGeocoding: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "forwardGeocoding",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    mapboxReverseGeocoding: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "reverseGeocoding",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    /** Mapbox Directions API */

    mapboxRetrieveDirections: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveDirections",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    /** Mapbox Isochrone API */

    mapboxRetrieveIsochrones: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveIsochrones",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    /** Mapbox Autofill API */

    mapboxSuggestAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "suggestAddress",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    mapboxRetrieveAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveAddress",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    mapboxCanRetrieveAddress: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "canRetrieveAddress",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),

    /** Mapbox Static Map API */

    mapboxRetrieveStaticMap: async ({ data: payload }) =>
      callExternalApiMethod({
        providerName: "mapbox",
        methodName: "retrieveStaticMap",
        payload,
        blockProtocolApiKey,
        blockProtocolSiteHost,
      }),
  };
};
