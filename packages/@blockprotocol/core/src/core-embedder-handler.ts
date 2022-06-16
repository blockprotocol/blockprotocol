import { CoreHandler } from "./core-handler";
import { EmbedderInitMessage, Message, MessageContents } from "./types";

/**
 * Implements the Block Protocol Core Specification for embedding applications.
 */
export class CoreEmbedderHandler extends CoreHandler {
  constructor({ element }: { element: HTMLElement }) {
    super({ element, sourceType: "embedder" });
  }

  initialize() {}

  /**
   * Update the HTML element messages are exchanged via.
   * @param element the new element to use for dispatching and listening to messages.
   */
  private updateElement(this: CoreEmbedderHandler, element: HTMLElement) {
    this.removeEventListeners();
    this.element = element;
    this.attachEventListeners();
  }

  /**
   * Updates the element being used to exchange messages via to an event's target.
   * @param event the event dispatched from the element to use
   */
  private updateElementFromEvent(
    this: CoreEmbedderHandler,
    event: CustomEvent,
  ) {
    if (!event.target) {
      throw new Error("Could not update element from event – no event.target.");
    }
    if (!(event.target instanceof HTMLElement)) {
      throw new Error(
        "'blockprotocolmessage' event must be sent from an HTMLElement.",
      );
    }
    this.updateElement(event.target);
  }

  /**
   * Process the initial message sent from the block.
   * Sends a {@link EmbedderInitMessage} in response, which has all the messages
   * from registered services which can be sentOnInitialization.
   */
  protected processInitMessage(
    this: CoreEmbedderHandler,
    {
      event,
      message,
    }: {
      event: CustomEvent;
      message: Message;
    },
  ) {
    this.updateElementFromEvent(event);

    // get the properties sent on initialization for any registered services
    const data: EmbedderInitMessage = {};
    for (const [serviceName, serviceInstance] of this.services) {
      data[serviceName] = serviceInstance.getInitPayload();
    }

    const response: MessageContents = {
      messageName: "initResponse",
      data,
    };

    void this.sendMessage({
      partialMessage: response,
      requestId: message.requestId,
      sender: this,
    });
  }
}
