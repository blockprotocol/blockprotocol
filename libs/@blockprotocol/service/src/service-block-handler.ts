import { ModuleHandler } from "@blockprotocol/core";

/**
 * There's an issue when importing useServiceEmbedderModule from @blockprotocol/service/react in hashintel/hash:
 * NextJS's output file tracing does not include service-service.json, and yet an import statement for it is preserved.
 * This leads to a 'module cannot be found error'. For now, commenting out the import of the JSON from this file.
 * @todo restore this when module resolution issue resolved
 * @see https://app.asana.com/0/1202542409311090/1202614421149286/f
 */
// import serviceModuleJson from "./service-service.json" assert { type: "json" };
import {
  BlockServiceMessageCallbacks,
  BlockServiceMessages,
  MapboxCanRetrieveAddressData,
  MapboxCanRetrieveAddressResponseData,
  MapboxForwardGeocodingData,
  MapboxForwardGeocodingResponseData,
  MapboxRetrieveAddressData,
  MapboxRetrieveAddressResponseData,
  MapboxRetrieveDirectionsData,
  MapboxRetrieveDirectionsResponseData,
  MapboxRetrieveIsochronesData,
  MapboxRetrieveIsochronesResponseData,
  MapboxRetrieveStaticMapData,
  MapboxRetrieveStaticMapResponseData,
  MapboxReverseGeocodingData,
  MapboxReverseGeocodingResponseData,
  MapboxSuggestAddressData,
  MapboxSuggestAddressResponseData,
  OpenAICompleteTextData,
  OpenAICompleteTextResponseData,
  OpenAICreateImageData,
  OpenAICreateImageResponseData,
  ServiceMessageError,
} from "./types.js";

/**
 * Creates a handler for the service module for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the embedder.
 * Call the relevant methods to send messages to the embedder.
 */
export class ServiceBlockHandler
  extends ModuleHandler
  implements BlockServiceMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<BlockServiceMessageCallbacks>;
    element?: HTMLElement | null;
  }) {
    super({
      element,
      callbacks,
      moduleName: "service",
      sourceType: "block",
    });
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the service module
    return {};
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the service is first initialised.
   */
  registerCallbacks(callbacks: Partial<BlockServiceMessageCallbacks>) {
    super.registerCallbacks(callbacks);
  }

  /**
   * Removes multiple callbacks at once.
   * Useful when replacing previously registered callbacks
   */
  removeCallbacks(callbacks: Partial<BlockServiceMessageCallbacks>) {
    super.removeCallbacks(callbacks);
  }

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  on<K extends keyof BlockServiceMessageCallbacks>(
    this: ServiceBlockHandler,
    messageName: K,
    handlerFunction: BlockServiceMessageCallbacks[K],
  ) {
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "embedder";
    // const messageJsonDefinition = serviceModuleJson.messages.find(
    //   (message) =>
    //     message.messageName === messageName &&
    //     message.source === expectedMessageSource,
    // );
    // if (!messageJsonDefinition) {
    //   throw new Error(
    //     `No message with name '${messageName}' expected from ${expectedMessageSource}.`,
    //   );
    // }
    this.registerCallback({
      callback: handlerFunction,
      messageName,
    });
  }

  // @todo automate creation of these methods from service-service.json and types.ts

  /** OpenAI */

  openaiCreateImage({ data }: { data?: OpenAICreateImageData }) {
    return this.sendMessage<OpenAICreateImageResponseData, ServiceMessageError>(
      {
        message: {
          messageName: "openaiCreateImage",
          data,
        },
        respondedToBy: "openaiCreateImageResponse",
      },
    );
  }

  openaiCompleteText({ data }: { data?: OpenAICompleteTextData }) {
    return this.sendMessage<
      OpenAICompleteTextResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "openaiCompleteText",
        data,
      },
      respondedToBy: "openaiCompleteTextResponse",
    });
  }

  /** Mapbox Geocoding API */

  mapboxForwardGeocoding({ data }: { data?: MapboxForwardGeocodingData }) {
    return this.sendMessage<
      MapboxForwardGeocodingResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxForwardGeocoding",
        data,
      },
      respondedToBy: "mapboxForwardGeocodingResponse",
    });
  }

  mapboxReverseGeocoding({ data }: { data?: MapboxReverseGeocodingData }) {
    return this.sendMessage<
      MapboxReverseGeocodingResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxReverseGeocoding",
        data,
      },
      respondedToBy: "mapboxReverseGeocodingResponse",
    });
  }

  /** Mapbox Directions API */

  mapboxRetrieveDirections({ data }: { data?: MapboxRetrieveDirectionsData }) {
    return this.sendMessage<
      MapboxRetrieveDirectionsResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxRetrieveDirections",
        data,
      },
      respondedToBy: "mapboxRetrieveDirectionsResponse",
    });
  }

  /** Mapbox Isochrone API */

  mapboxRetrieveIsochrones({ data }: { data?: MapboxRetrieveIsochronesData }) {
    return this.sendMessage<
      MapboxRetrieveIsochronesResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxRetrieveIsochrones",
        data,
      },
      respondedToBy: "mapboxRetrieveIsochronesResponse",
    });
  }

  /** Mapbox Autofill API */

  mapboxSuggestAddress({ data }: { data?: MapboxSuggestAddressData }) {
    return this.sendMessage<
      MapboxSuggestAddressResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxSuggestAddress",
        data,
      },
      respondedToBy: "mapboxSuggestAddressResponse",
    });
  }

  mapboxRetrieveAddress({ data }: { data?: MapboxRetrieveAddressData }) {
    return this.sendMessage<
      MapboxRetrieveAddressResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxRetrieveAddress",
        data,
      },
      respondedToBy: "mapboxRetrieveAddressResponse",
    });
  }

  mapboxCanRetrieveAddress({ data }: { data?: MapboxCanRetrieveAddressData }) {
    return this.sendMessage<
      MapboxCanRetrieveAddressResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxCanRetrieveAddress",
        data,
      },
      respondedToBy: "mapboxCanRetrieveAddressResponse",
    });
  }

  /** Mapbox Static Maps API */

  mapboxRetrieveStaticMap({ data }: { data?: MapboxRetrieveStaticMapData }) {
    return this.sendMessage<
      MapboxRetrieveStaticMapResponseData,
      ServiceMessageError
    >({
      message: {
        messageName: "mapboxRetrieveStaticMap",
        data,
      },
      respondedToBy: "mapboxRetrieveStaticMapResponse",
    });
  }
}
