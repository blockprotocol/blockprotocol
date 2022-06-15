import { v4 as uuid } from "uuid";

import { ServiceHandler } from "./service-handler";
import {
  GenericMessageCallback,
  Message,
  MessageCallbacksByService,
  MessageData,
  PromiseRejecter,
  PromiseResolver,
  ResponseSettlersByRequestIdMap,
  SendMessageArgs,
} from "./types";

/**
 * Implements the Block Protocol Core Specification, i.e.:
 * - listening for and dispatching messages via events
 * - registering callbacks from service handlers
 * - processing incoming messages and calling callbacks as appropriate
 *
 * This base class handles those common functions. There are two implementers,
 * Block and Embedder, to handle the divergent functionality (e.g. init messages).
 */
export abstract class CoreHandler {
  /** a default callback for use where no callback is registered for a message */
  private readonly defaultMessageCallback?: GenericMessageCallback;

  /** an object containing registered callbacks for messages, by service and message name */
  private readonly messageCallbacksByService: MessageCallbacksByService = {};

  /** a map of promise settlers and expected response names for requests, by requestId */
  private readonly responseSettlersByRequestIdMap: ResponseSettlersByRequestIdMap =
    new Map();

  /** the service handlers which have been registered to receive and send messages */
  protected readonly services: Map<string, ServiceHandler> = new Map();

  /** the element on which messages will be listened to, and from which they will be dispatched */
  protected element: HTMLElement;

  /** whether the instance of CoreHandler belongs to a block or embedding application */
  protected readonly sourceType: "block" | "embedder";

  /** when this handler itself sends messages, serviceName identifies it as the core handler */
  readonly serviceName: "core" = "core";

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
      "service" in message &&
      "source" in message &&
      "messageName" in message
    );
  }

  /**
   * Register a ServiceHandler for the given element.
   * Will re-use the CoreHandler if it exists for that element, or create a new one.
   * Currently the only way CoreHandlers may be instantiated
   *
   * [FUTURE]: there may be a need to instantiate CoreHandlers without any services
   */
  static registerService({
    element,
    service,
  }: {
    element: HTMLElement;
    service: ServiceHandler;
  }) {
    const { serviceName } = service;
    const handler =
      this.instanceMap.get(element) ?? Reflect.construct(this, [{ element }]);
    handler.services.set(serviceName, service);
    handler.messageCallbacksByService[serviceName] ??= new Map();
    return handler;
  }

  unregisterService({ service }: { service: ServiceHandler }) {
    const { serviceName } = service;
    this.services.delete(serviceName);
    if (this.services.size === 0) {
      this.removeEventListeners();
      CoreHandler.instanceMap.delete(this.element);
    }
  }

  protected constructor({
    element,
    sourceType,
  }: {
    element: HTMLElement;
    sourceType: "block" | "embedder";
  }) {
    this.element = element;
    this.sourceType = sourceType;
    (this.constructor as typeof CoreHandler).instanceMap.set(element, this);

    this.attachEventListeners();
  }

  abstract initialize(): void;

  private eventListener = (event: Event) => {
    this.processReceivedMessage(event as CustomEvent);
  };

  protected attachEventListeners(this: CoreHandler) {
    if (!this.element) {
      throw new Error(
        "Cannot attach event listeners before element set on CoreHandler instance.",
      );
    }
    this.element.addEventListener(
      CoreHandler.customEventName,
      this.eventListener,
    );
  }

  protected removeEventListeners(this: CoreHandler) {
    this.element?.removeEventListener(
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
      serviceName,
    }: {
      callback: GenericMessageCallback;
      messageName: string;
      serviceName: string;
    },
  ) {
    this.messageCallbacksByService[serviceName] ??= new Map();
    this.messageCallbacksByService[serviceName]!.set(messageName, callback);
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
    if (!sender.serviceName) {
      throw new Error("Message sender has no serviceName set.");
    }
    const fullMessage: Message = {
      ...partialMessage,
      requestId: requestId ?? uuid(),
      respondedToBy: "respondedToBy" in args ? args.respondedToBy : undefined,
      service: sender.serviceName,
      source: this.sourceType,
    };

    const event = new CustomEvent(CoreHandler.customEventName, {
      bubbles: true,
      composed: true,
      detail: fullMessage,
    });
    this.element.dispatchEvent(event);

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
      return promise;
    }
  }

  /**
   * Calls any callback which has been registered for the provided message.
   *
   * @throws Error if expected responses could not be produced, or callbacks error when called
   */
  protected async callCallback({ message }: { message: Message }) {
    const { errors, messageName, data, requestId, respondedToBy, service } =
      message;

    const callback: GenericMessageCallback | undefined =
      this.messageCallbacksByService[service]?.get(messageName) ??
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
      const serviceHandler = this.services.get(service);
      if (!serviceHandler) {
        throw new Error(`Handler for service ${service} not registered.`);
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
          sender: serviceHandler,
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

    const { errors, messageName, data, requestId, service } = message;

    if (
      service === "core" &&
      ((this.sourceType === "embedder" && messageName === "init") ||
        (this.sourceType === "block" && messageName === "initResponse"))
    ) {
      this.processInitMessage({ event: messageEvent, message });
      return;
    }

    // @todo should we await this?
    this.callCallback({ message }).catch((err) => {
      // eslint-disable-next-line no-console -- intentional feedback for users
      console.error(
        `Error calling callback for '${service}' service, for message '${messageName}: ${err}`,
      );
      throw err;
    });

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
