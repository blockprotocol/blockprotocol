import { ServiceHandler } from "@blockprotocol/core";

/**
 * There's an issue when importing useServiceEmbedderService from @blockprotocol/service/react in hashintel/hash:
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
} from "./types.js";

/**
 * Creates a handler for the service module for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the embedder.
 * Call the relevant methods to send messages to the embedder.
 */
export class ServiceBlockHandler
  extends ServiceHandler
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
      serviceName: "service",
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

  /** Mapbox Geocoding API */

  mapboxForwardGeocoding({ data }: { data?: MapboxForwardGeocodingData }) {
    return this.sendMessage<MapboxForwardGeocodingResponseData, null>({
      message: {
        messageName: "mapboxForwardGeocoding",
        data,
      },
      respondedToBy: "mapboxForwardGeocodingResponse",
    });
  }

  mapboxReverseGeocoding({ data }: { data?: MapboxReverseGeocodingData }) {
    return this.sendMessage<MapboxReverseGeocodingResponseData, null>({
      message: {
        messageName: "mapboxReverseGeocoding",
        data,
      },
      respondedToBy: "mapboxReverseGeocodingResponse",
    });
  }

  /** Mapbox Directions API */

  mapboxRetrieveDirections({ data }: { data?: MapboxRetrieveDirectionsData }) {
    return this.sendMessage<MapboxRetrieveDirectionsResponseData, null>({
      message: {
        messageName: "mapboxRetrieveDirections",
        data,
      },
      respondedToBy: "mapboxRetrieveDirectionsResponse",
    });
  }

  /** Mapbox Isochrone API */

  mapboxRetrieveIsochrones({ data }: { data?: MapboxRetrieveIsochronesData }) {
    return this.sendMessage<MapboxRetrieveIsochronesResponseData, null>({
      message: {
        messageName: "mapboxRetrieveIsochrones",
        data,
      },
      respondedToBy: "mapboxRetrieveIsochronesResponse",
    });
  }

  /** Mapbox Autofill API */

  mapboxSuggestAddress({ data }: { data?: MapboxSuggestAddressData }) {
    return this.sendMessage<MapboxSuggestAddressResponseData, null>({
      message: {
        messageName: "mapboxSuggestAddress",
        data,
      },
      respondedToBy: "mapboxSuggestAddressResponse",
    });
  }

  mapboxRetrieveAddress({ data }: { data?: MapboxRetrieveAddressData }) {
    return this.sendMessage<MapboxRetrieveAddressResponseData, null>({
      message: {
        messageName: "mapboxRetrieveAddress",
        data,
      },
      respondedToBy: "mapboxRetrieveAddressResponse",
    });
  }

  mapboxCanRetrieveAddress({ data }: { data?: MapboxCanRetrieveAddressData }) {
    return this.sendMessage<MapboxCanRetrieveAddressResponseData, null>({
      message: {
        messageName: "mapboxCanRetrieveAddress",
        data,
      },
      respondedToBy: "mapboxCanRetrieveAddressResponse",
    });
  }

  /** Mapbox Static Maps API */

  mapboxRetrieveStaticMap({ data }: { data?: MapboxRetrieveStaticMapData }) {
    return this.sendMessage<MapboxRetrieveStaticMapResponseData, null>({
      message: {
        messageName: "mapboxRetrieveStaticMap",
        data,
      },
      respondedToBy: "mapboxRetrieveStaticMapResponse",
    });
  }
}
