import { ServiceEmbedderMessageCallbacks } from "@blockprotocol/service";
import apiFetch from "@wordpress/api-fetch";
import { Fragment } from "react";

import { ToastProps } from "./toast";

type ServiceFunction =
  ServiceEmbedderMessageCallbacks[keyof ServiceEmbedderMessageCallbacks];

const billingUrl = "https://blockprotocol.org/account/billing";

type DisplayToastFunction = (toastProps: ToastProps) => void;

export const callService = async (
  {
    providerName,
    methodName,
    data,
  }: {
    providerName: string;
    methodName: string;
    data: Parameters<ServiceFunction>[0]["data"];
  },
  displayToast: DisplayToastFunction,
): Promise<{
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
    let errorMessage = apiResponse.error ?? "An unknown error occurred";
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
        "You have an unpaid invoice. Please pay it to make more API calls.";
    } else if (errorMessage.includes("monthly overage")) {
      errorMessage =
        "You have reached the monthly overage cap you set. Please increase it to make more calls this month.";
      actions.unshift({
        url: billingUrl,
        label: "Increase",
      });
    } else if (errorMessage.includes("monthly free units")) {
      actions.unshift({
        url: billingUrl,
        label: "Upgrade",
      });
      errorMessage = `You have exceeded your free calls for this ${providerName} service. Please upgrade to use it again this month.`;
    }

    displayToast({
      content: (
        <div>
          {errorMessage}{" "}
          {actions.map((action, index) => (
            <Fragment key={action.url}>
              {index > 0 && " | "}
              <a href={action.url} target="_blank" rel="noreferrer">
                {action.label}
              </a>
            </Fragment>
          ))}
        </div>
      ),
      type: "error",
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

export const constructServiceModuleCallbacks = (
  displayToast: DisplayToastFunction,
): ServiceEmbedderMessageCallbacks => {
  return {
    /** OpenAI */

    openaiCreateImage: async ({ data }) =>
      callService(
        {
          providerName: "openai",
          methodName: "createImage",
          data,
        },
        displayToast,
      ),

    openaiCompleteChat: async ({ data }) =>
      callService(
        {
          providerName: "openai",
          methodName: "completeChat",
          data,
        },
        displayToast,
      ),

    openaiCompleteText: async ({ data }) =>
      callService(
        {
          providerName: "openai",
          methodName: "completeText",
          data,
        },
        displayToast,
      ),

    /** Mapbox Geocoding API */

    mapboxForwardGeocoding: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "forwardGeocoding",
          data,
        },
        displayToast,
      ),

    mapboxReverseGeocoding: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "reverseGeocoding",
          data,
        },
        displayToast,
      ),

    /** Mapbox Directions API */

    mapboxRetrieveDirections: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "retrieveDirections",
          data,
        },
        displayToast,
      ),

    /** Mapbox Isochrone API */

    mapboxRetrieveIsochrones: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "retrieveIsochrones",
          data,
        },
        displayToast,
      ),

    /** Mapbox Autofill API */

    mapboxSuggestAddress: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "suggestAddress",
          data,
        },
        displayToast,
      ),

    mapboxRetrieveAddress: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "retrieveAddress",
          data,
        },
        displayToast,
      ),

    mapboxCanRetrieveAddress: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "canRetrieveAddress",
          data,
        },
        displayToast,
      ),

    /** Mapbox Static Map API */

    mapboxRetrieveStaticMap: async ({ data }) =>
      callService(
        {
          providerName: "mapbox",
          methodName: "retrieveStaticMap",
          data,
        },
        displayToast,
      ),
  };
};
