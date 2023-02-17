import { v4 as uuid } from "uuid";

import { ModuleHandler } from "./module-handler";
import {
  GenericMessageCallback,
  Message,
  MessageCallbacksByModule,
  MessageData,
  PromiseRejecter,
  PromiseResolver,
  ResponseSettlersByRequestIdMap,
  SendMessageArgs,
} from "./types";

/**
 * Implements the Block Protocol Core Specification, i.e.:
 * - listening for and dispatching messages via events
 * - registering callbacks from module handlers
 * - processing incoming messages and calling callbacks as appropriate
 *
 * This base class handles those common functions. There are two implementers,
 * Block and Embedder, to handle the divergent functionality (e.g. init messages).
 */
export abstract class CoreHandler {
  /** Keeps track of if initialized, to know if can send messages yet */
  private hasInitialized: boolean = false;

  /** We won't send any non-init messages until we're initialized */
  protected messageQueue: Omit<Message, "timestamp">[] = [];

  /** a default callback for use where no callback is registered for a message */
  private readonly defaultMessageCallback?: GenericMessageCallback;

  /** an object containing registered callbacks for messages, by module and message name */
  private readonly messageCallbacksByModule: MessageCallbacksByModule = {};

  /** a map of promise settlers and expected response names for requests, by requestId */
  private readonly responseSettlersByRequestIdMap: ResponseSettlersByRequestIdMap =
    new Map();

  /** the module handlers which have been registered to receive and send messages */
  protected readonly modules: Map<string, ModuleHandler> = new Map();

  /**
   * the element on which messages will be listened for
   */
  protected listeningElement: HTMLElement;

  /**
   * The element on which messages will be dispatched from.
   * For blocks, this is always the same as the listening element.
   * Embedding applications must wait for an event from the block and then update the dispatching element
   * to the target of that event, so that the block can receive messages on it.
   */
  protected dispatchingElement: HTMLElement;

  /** whether the instance of CoreHandler belongs to a block or embedding application */
  protected readonly sourceType: "block" | "embedder";

  /** when this handler itself sends messages, moduleName identifies it as the core handler */
  readonly moduleName: "core" = "core";

  /**
   * Handles the initialization messages exchanged when a block registers a handler
   * 1. the block sends a message
   * 2. the embedder calls processInitMessage to generate a response,
   *   including initial values for messages which are 'sentOnInitialization: true'
   * 3. the block calls processInitMessage to process the response and values sent in (2)
   * */
  protected abstract processInitMessage(args: {
    event: CustomEvent;
    message: Message;
  }): void;

  /** the event name used to transport messages */
  private static readonly customEventName = "blockprotocolmessage";

  /**
   * A map of instances of CoreHandler, by the element they are listening on,
   * used to ensure that two handlers aren't instantiated for the same element.
   */
  private static readonly instanceMap = new WeakMap<HTMLElement, CoreHandler>();

  private static isBlockProtocolMessage(message: unknown): message is Message {
    return (
      typeof message === "object" &&
      message !== null &&
      !Array.isArray(message) &&
      "requestId" in message &&
      "module" in message &&
      "source" in message &&
      "messageName" in message
    );
  }

  /**
   * Register a ModuleHandler for the given element.
   * Will re-use the CoreHandler if it exists for that element, or create a new one.
   * Currently the only way CoreHandlers may be instantiated
   *
   * [FUTURE]: there may be a need to instantiate CoreHandlers without any modules
   */
  static registerModule({
    element,
    module,
  }: {
    element: HTMLElement;
    module: ModuleHandler;
  }) {
    const { moduleName } = module;
    const handler =
      this.instanceMap.get(element) ?? Reflect.construct(this, [{ element }]);
    handler.modules.set(moduleName, module);
    handler.messageCallbacksByModule[moduleName] ??= new Map();
    return handler;
  }

  unregisterModule({ module }: { module: ModuleHandler }) {
    const { moduleName } = module;
    this.modules.delete(moduleName);
    if (this.modules.size === 0) {
      this.removeEventListeners();
      CoreHandler.instanceMap.delete(this.listeningElement);
    }
  }

  protected constructor({
    element,
    sourceType,
  }: {
    element: HTMLElement;
    sourceType: "block" | "embedder";
  }) {
    this.listeningElement = element;
    this.dispatchingElement = element;

    this.sourceType = sourceType;
    (this.constructor as typeof CoreHandler).instanceMap.set(element, this);

    this.attachEventListeners();
  }

  abstract initialize(): void;

  /**
   * We defer some tasks until after initialization, but that process is handled
   * by the block/embedder, which will call this function when done
   */
  protected afterInitialized() {
    if (this.hasInitialized) {
      throw new Error("Already initialized");
    }

    this.hasInitialized = true;

    while (this.messageQueue.length) {
      const message = this.messageQueue.shift();
      if (message) {
        this.dispatchMessage(message);
      }
    }
  }

  private eventListener = (event: Event) => {
    this.processReceivedMessage(event as CustomEvent);
  };

  protected attachEventListeners(this: CoreHandler) {
    if (!this.listeningElement) {
      throw new Error(
        "Cannot attach event listeners before element set on CoreHandler instance.",
      );
    }
    this.listeningElement.addEventListener(
      CoreHandler.customEventName,
      this.eventListener,
    );
  }

  protected removeEventListeners(this: CoreHandler) {
    this.listeningElement?.removeEventListener(
      CoreHandler.customEventName,
      this.eventListener,
    );
  }

  /**
   * Registers a callback which will be called when the specified message is received.
   */
  registerCallback(
    this: CoreHandler,
    {
      callback,
      messageName,
      moduleName,
    }: {
      callback: GenericMessageCallback;
      messageName: string;
      moduleName: string;
    },
  ) {
    this.messageCallbacksByModule[moduleName] ??= new Map();
    this.messageCallbacksByModule[moduleName]!.set(messageName, callback);
  }

  removeCallback(
    this: CoreHandler,
    {
      callback,
      messageName,
      moduleName,
    }: {
      callback: GenericMessageCallback;
      messageName: string;
      moduleName: string;
    },
  ) {
    const map = this.messageCallbacksByModule[moduleName];
    if (map?.get(messageName) === callback) {
      map.delete(messageName);
    }
  }

  sendMessage(this: CoreHandler, args: SendMessageArgs): void;

  sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: CoreHandler,
    args: SendMessageArgs & { respondedToBy: string },
  ): Promise<MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>>;

  /**
   * Sends a message by dispatching a CustomEvent containing the message details.
   * If the message expects a response, i.e. has a value for respondedToBy,
   * this will return a promise which will be settled when the response is received.
   */
  sendMessage<
    ExpectedResponseData,
    ExpectedResponseErrorCodes extends string | null,
  >(
    this: CoreHandler,
    args: SendMessageArgs | (SendMessageArgs & { respondedToBy: string }),
  ): void | Promise<
    MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>
  > {
    const { partialMessage, requestId, sender } = args;
    if (!sender.moduleName) {
      throw new Error("Message sender has no moduleName set.");
    }
    const fullMessage: Omit<Message, "timestamp"> = {
      ...partialMessage,
      requestId: requestId ?? uuid(),
      respondedToBy: "respondedToBy" in args ? args.respondedToBy : undefined,
      module: sender.moduleName,
      source: this.sourceType,
    };

    if ("respondedToBy" in args && args.respondedToBy) {
      let resolverToStore: PromiseResolver | undefined = undefined;
      let rejecterToStore: PromiseRejecter | undefined = undefined;
      const promise = new Promise<
        MessageData<ExpectedResponseData, ExpectedResponseErrorCodes>
      >((resolve, reject) => {
        resolverToStore = resolve as any; // @todo fix these casts
        rejecterToStore = reject as any;
      });
      this.responseSettlersByRequestIdMap.set(fullMessage.requestId, {
        expectedResponseName: args.respondedToBy,
        resolve: resolverToStore!,
        reject: rejecterToStore!,
      });

      this.dispatchMessage(fullMessage);

      return promise;
    }

    this.dispatchMessage(fullMessage);
  }

  private dispatchMessage(fullMessage: Omit<Message, "timestamp">) {
    if (
      !this.hasInitialized &&
      fullMessage.messageName !== "init" &&
      fullMessage.messageName !== "initResponse"
    ) {
      this.messageQueue.push(fullMessage);
      return;
    }

    const event = new CustomEvent(CoreHandler.customEventName, {
      bubbles: true,
      composed: true,
      detail: {
        ...fullMessage,
        timestamp: new Date().toISOString(),
      },
    });

    this.dispatchingElement.dispatchEvent(event);
  }

  /**
   * Calls any callback which has been registered for the provided message.
   *
   * @throws Error if expected responses could not be produced, or callbacks error when called
   */
  protected async callCallback({ message }: { message: Message }) {
    const { errors, messageName, data, requestId, respondedToBy, module } =
      message;

    const callback: GenericMessageCallback | undefined =
      this.messageCallbacksByModule[module]?.get(messageName) ??
      this.defaultMessageCallback;

    if (respondedToBy && !callback) {
      throw new Error(
        `Message '${messageName}' expected a response, but no callback for '${messageName}' provided.`,
      );
    }

    if (!callback) {
      return;
    }

    // Produce and send a response, if this message requires one and a callback for it has been registered.
    if (respondedToBy) {
      const moduleHandler = this.modules.get(module);
      if (!moduleHandler) {
        throw new Error(`Handler for module ${module} not registered.`);
      }

      try {
        const { data: responsePayload, errors: responseErrors } =
          (await callback({ data, errors })) ?? {};

        this.sendMessage({
          partialMessage: {
            messageName: respondedToBy,
            data: responsePayload,
            errors: responseErrors as any, // @todo fix this cast
          },
          requestId,
          sender: moduleHandler,
        });
      } catch (err) {
        throw new Error(
          `Could not produce response to '${messageName}' message: ${
            (err as Error).message
          }`,
        );
      }
    } else {
      try {
        await callback({ data, errors });
      } catch (err) {
        throw new Error(
          `Error calling callback for message '${messageName}: ${err}`,
        );
      }
    }
  }

  /**
   * Checks all incoming events, and processes the Block Protocol messages:
   * 1. Settles outstanding promises where the message is a response to a previously sent message
   * 2. Calls any callbacks which have been registered for dealing with the message
   * 3. Processes the init messages - see {@link processInitMessage}
   */
  private processReceivedMessage(this: CoreHandler, messageEvent: CustomEvent) {
    if (messageEvent.type !== CoreHandler.customEventName) {
      return;
    }

    const message = messageEvent.detail;

    if (!CoreHandler.isBlockProtocolMessage(message)) {
      // Ignore events which aren't the special BP message
      return;
    } else if (message.source === this.sourceType) {
      // Ignore events which were sent by the block / embedder (whichever this is)
      return;
    }

    const { errors, messageName, data, requestId, module } = message;

    if (
      module === "core" &&
      ((this.sourceType === "embedder" && messageName === "init") ||
        (this.sourceType === "block" && messageName === "initResponse"))
    ) {
      this.processInitMessage({ event: messageEvent, message });
    } else {
      // @todo should we await this?
      this.callCallback({ message }).catch((err) => {
        // eslint-disable-next-line no-console -- intentional feedback for users
        console.error(
          `Error calling callback for '${module}' module, for message '${messageName}: ${err}`,
        );
        throw err;
      });
    }

    // Check if this message is responding to another, and settle the outstanding promise
    const messageAwaitingResponse =
      this.responseSettlersByRequestIdMap.get(requestId);

    if (messageAwaitingResponse) {
      if (messageAwaitingResponse.expectedResponseName !== messageName) {
        messageAwaitingResponse.reject(
          new Error(
            `Message with requestId '${requestId}' expected response from message named '${messageAwaitingResponse.expectedResponseName}', received response from '${messageName}' instead.`,
          ),
        );
      }
      messageAwaitingResponse.resolve({ data, errors });
      this.responseSettlersByRequestIdMap.delete(requestId);
    }
  }
}
