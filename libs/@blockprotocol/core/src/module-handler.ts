import { CoreBlockHandler } from "./core-block-handler.js";
import { CoreEmbedderHandler } from "./core-embedder-handler.js";
import type { CoreHandler } from "./core-handler.js";
import type {
  CoreHandlerCallback,
  GenericMessageCallback,
  MessageContents,
  MessageData,
} from "./types.js";

/**
 * The base class for creating module handlers from.
 * - registers the module with the CoreHandler
 * - provides methods for registering callbacks and sending messages
 */
export abstract class ModuleHandler {
  /** the CoreHandler this module is registered with, for passing messages via */
  private coreHandler: CoreHandler | null = null;

  /** the element messages are sent via */
  private element: HTMLElement | null = null;

  /**
   * the core handler is not available until element is set, so we need a queue
   */
  private coreQueue: CoreHandlerCallback[] = [];

  /**
   * If we register callbacks prior to creating the core handler, we want to
   * register those on the core handler once it is available, but before we
   * call initialize on it, to ensure callbacks which would catch messages sent
   * during initialize are registered. To enable that, we have a separate queue.
   */
  private preCoreInitializeQueue: CoreHandlerCallback[] = [];

  /** whether the instance of CoreHandler belongs to a block or embedding application */
  protected readonly sourceType: "block" | "embedder";

  /** the name of the module */
  readonly moduleName: string;

  destroyed?: boolean;

  /**
   * a method individual embedder modules handlers implement to provide the messages they send on initialization,
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
    callbacks,
    moduleName,
    sourceType,
  }: {
    element?: HTMLElement | null;
    callbacks?: Record<string, GenericMessageCallback>;
    moduleName: string;
    sourceType: "block" | "embedder";
  }) {
    this.moduleName = moduleName;
    this.sourceType = sourceType;

    if (callbacks) {
      this.registerCallbacks(callbacks);
    }

    if (element) {
      this.initialize(element);
    }
  }

  /**
   * You only need to use this if you are constructing a module directly.
   * You do not need to use it if you're using a React hook or block template.
   *
   * This initializes a module with the element it will listen for messages on,
   * and must be called if the module was constructed without an element.
   */
  initialize(element: HTMLElement) {
    if (!this.element) {
      this.registerModule(element);
    } else if (element !== this.element) {
      throw new Error(
        "Could not initialize – already initialized with another element",
      );
    }

    const coreHandler = this.coreHandler;

    if (!coreHandler) {
      throw new Error("Could not initialize – missing core handler");
    }

    this.processCoreCallbackQueue(this.preCoreInitializeQueue);

    coreHandler.initialize();

    this.processCoreQueue();
  }

  private registerModule(element: HTMLElement) {
    this.checkIfDestroyed();

    if (this.element) {
      throw new Error("Already registered");
    }

    this.element = element;

    if (this.sourceType === "block") {
      this.coreHandler = CoreBlockHandler.registerModule({
        element,
        module: this,
      });
    } else if (this.sourceType === "embedder") {
      this.coreHandler = CoreEmbedderHandler.registerModule({
        element,
        module: this,
      });
    } else {
      throw new Error(
        `Provided sourceType '${this.sourceType}' must be one of 'block' or 'embedder'.`,
      );
    }
  }

  /**
   * Unregister and clean up the module.
   */
  destroy() {
    this.coreHandler?.unregisterModule({ module: this });
    this.destroyed = true;
  }

  private checkIfDestroyed() {
    if (this.destroyed) {
      throw new Error(
        "Module has been destroyed. Please construct a new instance.",
      );
    }
  }

  /** Register callbacks with the CoreHandler to handle incoming messages of specific types */
  registerCallbacks(
    this: ModuleHandler,
    callbacks: Record<string, GenericMessageCallback>,
  ) {
    for (const [messageName, callback] of Object.entries(callbacks)) {
      this.registerCallback({ messageName, callback });
    }
  }

  /** Remove callbacks with the CoreHandler for incoming messages of specific types */
  removeCallbacks(
    this: ModuleHandler,
    callbacks: Record<string, GenericMessageCallback>,
  ) {
    for (const [messageName, callback] of Object.entries(callbacks)) {
      this.removeCallback({ messageName, callback });
    }
  }

  /** Register a callback with the CoreHandler to handle an incoming messages of a specific type */
  protected registerCallback(
    this: ModuleHandler,
    {
      messageName,
      callback,
    }: {
      messageName: string;
      callback: GenericMessageCallback;
    },
  ) {
    this.checkIfDestroyed();

    this.getRelevantQueueForCallbacks().push((coreHandler) =>
      coreHandler.registerCallback({
        callback,
        messageName,
        moduleName: this.moduleName,
      }),
    );

    this.processCoreQueue();
  }

  /**
   * When adding/removing callbacks before calling the core handler is
   * available, we want to queue these in a queue which will be processed before
   * calling initializing once we create the core handler, to ensure callbacks
   * are properly set up before calling initialize
   */
  private getRelevantQueueForCallbacks() {
    return this.coreHandler ? this.coreQueue : this.preCoreInitializeQueue;
  }

  /** Remove a callback from the CoreHandler for an incoming messages of a specific type */
  protected removeCallback(
    this: ModuleHandler,
    {
      messageName,
      callback,
    }: {
      messageName: string;
      callback: GenericMessageCallback;
    },
  ) {
    this.checkIfDestroyed();

    this.getRelevantQueueForCallbacks().push((coreHandler) =>
      coreHandler.removeCallback({
        callback,
        messageName,
        moduleName: this.moduleName,
      }),
    );

    this.processCoreQueue();
  }

  private processCoreQueue() {
    this.processCoreCallbackQueue(this.coreQueue);
  }

  private processCoreCallbackQueue(queue: CoreHandlerCallback[]) {
    const coreHandler = this.coreHandler;
    if (coreHandler) {
      while (queue.length) {
        const callback = queue.shift();
        if (callback) {
          callback(coreHandler);
        }
      }
    }
  }

  protected sendMessage(
    this: ModuleHandler,
    args: { message: MessageContents },
  ): void;

  protected sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: ModuleHandler,
    args: { message: MessageContents; respondedToBy: string },
  ): Promise<MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>>;

  /** Send a message via the CoreHandler */
  protected sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: ModuleHandler,
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
      return new Promise<
        MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>
      >((resolve, reject) => {
        this.coreQueue.push((coreHandler) => {
          coreHandler
            .sendMessage<ExpectedResponseData, ExpectedResponseErrorCodes>({
              partialMessage: message,
              respondedToBy: args.respondedToBy,
              sender: this,
            })
            .then(resolve, reject);
        });

        this.processCoreQueue();
      });
    }

    this.coreQueue.push((coreHandler) =>
      coreHandler.sendMessage({
        partialMessage: message,
        sender: this,
      }),
    );

    this.processCoreQueue();
  }
}
