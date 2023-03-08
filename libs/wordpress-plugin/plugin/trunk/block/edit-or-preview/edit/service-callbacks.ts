import { ServiceEmbedderMessageCallbacks } from "@blockprotocol/service";
import apiFetch from "@wordpress/api-fetch";
import { dispatch } from "@wordpress/data";

type ServiceFunction =
  ServiceEmbedderMessageCallbacks[keyof ServiceEmbedderMessageCallbacks];

const billingUrl = "https://blockprotocol.org/settings/billing";

export const callService = async ({
  providerName,
  methodName,
  data,
}: {
  providerName: string;
  methodName: string;
  data: Parameters<ServiceFunction>[0]["data"];
}): Promise<{
  data?: any;
  errors?: Awaited<ReturnType<ServiceFunction>>["errors"];
}> => {
  const apiResponse = await apiFetch<
    Awaited<ReturnType<ServiceFunction>> | { error?: string }
  >({
    path: "/blockprotocol/service",
    method: "POST",
    body: JSON.stringify({
      provider_name: providerName,
      method_name: methodName,
      data,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if ("error" in apiResponse) {
    let errorMessage = apiResponse.error ?? "An unknown error occured";
    const actions = [
      {
        url: "https://blockprotocol.org/contact",
        label: "Get Help",
      },
    ];

    if (errorMessage.includes("unpaid")) {
      actions.unshift({
        url: billingUrl,
        label: "Billing",
      });
      errorMessage =
        "You have an unpaid Block Protocol invoice. Please pay them to make more API calls.";
    } else if (errorMessage.includes("monthly overage")) {
      errorMessage =
        "You have reached the monthly overage charge cap you previously set. Please increase it to make more API calls this months.";
      actions.unshift({
        url: billingUrl,
        label: "Increase",
      });
    } else if (errorMessage.includes("monthly free units")) {
      actions.unshift({
        url: billingUrl,
        label: "Upgrade",
      });
      errorMessage = `You have exceeded your monthly free API calls for this ${providerName} service. Please upgrade your Block Protocol account to use this service again, this month.`;
    }

    dispatch("core/notices").createNotice("error", errorMessage, {
      isDismissible: true,
      actions,
    });
    return {
      errors: [
        {
          code: "INTERNAL_ERROR",
          message: errorMessage,
        },
      ],
    };
  }

  return apiResponse as any;
};

export const constructServiceModuleCallbacks =
  (): ServiceEmbedderMessageCallbacks => {
    return {
      /** OpenAI */

      openaiCreateImage: async ({ data }) =>
        callService({
          providerName: "openai",
          methodName: "createImage",
          data,
        }),

      openaiCompleteText: async ({ data }) =>
        callService({
          providerName: "openai",
          methodName: "completeText",
          data,
        }),

      /** Mapbox Geocoding API */

      mapboxForwardGeocoding: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "forwardGeocoding",
          data,
        }),

      mapboxReverseGeocoding: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "reverseGeocoding",
          data,
        }),

      /** Mapbox Directions API */

      mapboxRetrieveDirections: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "retrieveDirections",
          data,
        }),

      /** Mapbox Isochrone API */

      mapboxRetrieveIsochrones: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "retrieveIsochrones",
          data,
        }),

      /** Mapbox Autofill API */

      mapboxSuggestAddress: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "suggestAddress",
          data,
        }),

      mapboxRetrieveAddress: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "retrieveAddress",
          data,
        }),

      mapboxCanRetrieveAddress: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "canRetrieveAddress",
          data,
        }),

      /** Mapbox Static Map API */

      mapboxRetrieveStaticMap: async ({ data }) =>
        callService({
          providerName: "mapbox",
          methodName: "retrieveStaticMap",
          data,
        }),
    };
  };
