import { CoreHandler } from "./core-handler";
import { EmbedderInitMessage, Message } from "./types";

/**
 * Implements the Block Protocol Core Specification for blocks.
 */
export class CoreBlockHandler extends CoreHandler {
  private sentInitMessage = false;

  constructor({ element }: { element: HTMLElement }) {
    super({ element, sourceType: "block" });
  }

  /**
   * Send the init message, to which an initResponse is expected from the embedder.
   * The response will be processed in {@link processInitMessage}
   *
   * We send it repeatedly because the embedder may not yet have attached
   * its listeners
   */
  initialize() {
    if (!this.sentInitMessage) {
      this.sentInitMessage = true;
      void this.sendInitMessage().then(() => {
        this.afterInitialized();
      });
    }
  }

  private sendInitMessage(): Promise<void> {
    const resp = this.sendMessage<EmbedderInitMessage, null>({
      partialMessage: { messageName: "init" },
      respondedToBy: "initResponse",
      sender: this,
    });

    // In case the embedding application's handler is set up after the block's,
    // retry the init message.
    return Promise.race([
      resp,

      new Promise<void>((resolve) => {
        // using queueMicrotask here leads to an infinite loop with some rendering strategies
        // we could consider using setImmediate instead, but it would add a dependency.
        // the 'time to init message exchange' is only material for:
        // 1) HTML blocks, which depend on the exchange of init messages to receive init data
        // 2) any block which sends other messages immediately after the init exchange
        // React and Custom Element blocks receive their initial data as properties.
        setTimeout(resolve);
      }),
    ]).then((response) => {
      if (!response) {
        return this.sendInitMessage();
      }
    });
  }

  /**
   * Receives the {@link EmbedderInitMessage} sent by the embedding application,
   * which is a series of payloads namespaced by module and message name.
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
    for (const moduleName of Object.keys(data)) {
      for (const messageName of Object.keys(data[moduleName])) {
        void this.callCallback({
          message: {
            ...message,
            data: data[moduleName][messageName],
            messageName,
            module: moduleName,
          },
        });
      }
    }
  }
}
