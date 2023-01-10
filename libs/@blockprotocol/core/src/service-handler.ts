import { CoreBlockHandler } from "./core-block-handler";
import { CoreEmbedderHandler } from "./core-embedder-handler";
import { CoreHandler } from "./core-handler";
import { GenericMessageCallback, MessageContents, MessageData } from "./types";

/**
 * The base class for creating service handlers from.
 * - registers the service with the CoreHandler
 * - provides methods for registering callbacks and sending messages
 */
export abstract class ServiceHandler {
  /** the CoreHandler this service is registered with, for passing messages via */
  readonly coreHandler: CoreHandler;
  /** the element messages are sent via */
  private readonly element: HTMLElement;

  /** whether the instance of CoreHandler belongs to a block or embedding application */
  protected readonly sourceType: "block" | "embedder";

  /** the name of the service */
  readonly serviceName: string;

  destroyed?: boolean;

  /**
   * a method individual embedder services handlers implement to provide the messages they send on initialization,
   * i.e. the messages that are marked as 'sentOnInitialization: true'.
   * the payloads of these are combined and sent in the embedder's 'initResponse' message
   *
   * [FUTURE]: if and when there are block messages which are sentOnInitialization, these could
   *   be sent via the blocks initial 'init' message. See {@link CoreHandler.processInitMessage}
   */
  abstract getInitPayload(): Record<string, any>;

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  abstract on(
    messageName: string,
    handlerFunction: GenericMessageCallback,
  ): void;

  protected constructor({
    element,
    serviceName,
    sourceType,
  }: {
    element: HTMLElement;
    serviceName: string;
    sourceType: "block" | "embedder";
  }) {
    this.element = element ?? null;
    this.serviceName = serviceName;
    this.sourceType = sourceType;

    if (this.sourceType === "block") {
      this.coreHandler = CoreBlockHandler.registerService({
        element,
        service: this,
      });
    } else if (this.sourceType === "embedder") {
      this.coreHandler = CoreEmbedderHandler.registerService({
        element,
        service: this,
      });
    } else {
      throw new Error(
        `Provided sourceType '${sourceType}' must be one of 'block' or 'embedder'.`,
      );
    }
  }

  /**
   * Unregister and clean up the service.
   */
  destroy() {
    this.coreHandler.unregisterService({ service: this });
    this.destroyed = true;
  }

  private checkIfDestroyed() {
    if (this.destroyed) {
      throw new Error(
        "Service has been destroyed. Please construct a new instance.",
      );
    }
  }

  /** Register callbacks with the CoreHandler to handle incoming messages of specific types */
  registerCallbacks(
    this: ServiceHandler,
    callbacks: Record<string, GenericMessageCallback>,
  ) {
    for (const [messageName, callback] of Object.entries(callbacks)) {
      this.registerCallback({ messageName, callback });
    }
  }

  /** Register a callback with the CoreHandler to handle an incoming messages of a specific type */
  protected registerCallback(
    this: ServiceHandler,
    {
      messageName,
      callback,
    }: {
      messageName: string;
      callback: GenericMessageCallback;
    },
  ) {
    this.checkIfDestroyed();

    this.coreHandler.registerCallback({
      callback,
      messageName,
      serviceName: this.serviceName,
    });
  }

  protected sendMessage(
    this: ServiceHandler,
    args: { message: MessageContents },
  ): void;

  protected sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: ServiceHandler,
    args: { message: MessageContents; respondedToBy: string },
  ): Promise<MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>>;

  /** Send a message via the CoreHandler */
  protected sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: ServiceHandler,
    args:
      | {
          message: MessageContents;
          respondedToBy: string;
        }
      | { message: MessageContents },
  ) {
    this.checkIfDestroyed();

    const { message } = args;
    if ("respondedToBy" in args) {
      return this.coreHandler.sendMessage<
        ExpectedResponseData,
        ExpectedResponseErrorCodes
      >({
        partialMessage: message,
        respondedToBy: args.respondedToBy,
        sender: this,
      });
    }
    return this.coreHandler.sendMessage({
      partialMessage: message,
      sender: this,
    });
  }
}
