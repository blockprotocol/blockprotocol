import { CoreHandler } from "./core-handler";
import { EmbedderInitMessage, Message } from "./types";

/**
 * Implements the Block Protocol Core Specification for blocks.
 */
export class CoreBlockHandler extends CoreHandler {
  constructor({ element }: { element: HTMLElement }) {
    super({ element, sourceType: "block" });
  }

  /**
   * Send the init message, to which an initResponse is expected from the embedder.
   * The response will be processed in {@link processInitMessage}
   */
  initialize() {
    void this.sendMessage({
      partialMessage: { messageName: "init" },
      respondedToBy: "initResponse",
      sender: this,
    });
  }

  /**
   * Receives the {@link EmbedderInitMessage} sent by the embedding application,
   * which is a series of payloads namespaced by service and message name.
   * Calls the individual callbacks registered for each of these values.
   *
   * Useful for HTML blocks receiving messages which are sent on initialization by the app
   * – other types of blocks can receive these messages synchronously via properties.
   */
  protected processInitMessage(
    this: CoreBlockHandler,
    {
      message,
    }: {
      event: CustomEvent;
      message: Message & { data: EmbedderInitMessage };
    },
  ) {
    const { data } = message;
    for (const serviceName of Object.keys(data)) {
      for (const messageName of Object.keys(data[serviceName])) {
        void this.callCallback({
          message: {
            ...message,
            data: data[serviceName][messageName],
            messageName,
            service: serviceName,
          },
        });
      }
    }
  }
}
