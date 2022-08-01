import { ServiceHandler } from "@blockprotocol/core";

import serviceJsonDefinition from "./hook-service.json";
import {
  BlockHookMessageCallbacks,
  BlockHookMessages,
  HookData,
  HookError,
  HookResponse,
} from "./types";

/**
 * Creates a handler for the hook service for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to
 * react to messages from the embedder. Call the relevant methods to send
 * messages to the embedder.
 */
export class HookBlockHandler
  extends ServiceHandler
  implements BlockHookMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<BlockHookMessageCallbacks>;
    element: HTMLElement;
  }) {
    super({ element, serviceName: "hook", sourceType: "block" });
    if (callbacks) {
      this.registerCallbacks(callbacks);
    }
    this.coreHandler.initialize();
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the hook
    // service
    return {};
  }

  on<K extends keyof BlockHookMessageCallbacks>(
    this: HookBlockHandler,
    messageName: K,
    handlerFunction: BlockHookMessageCallbacks[K],
  ) {
    const expectedMessageSource = "embedder";
    const messageJsonDefinition = serviceJsonDefinition.messages.find(
      (message) =>
        message.messageName === messageName &&
        message.source === expectedMessageSource,
    );
    if (!messageJsonDefinition) {
      throw new Error(
        `No message with name '${messageName}' expected from ${expectedMessageSource}.`,
      );
    }
    this.registerCallback({
      callback: handlerFunction,
      messageName,
    });
  }

  // @todo automate creation of these methods from hook-service.json and
  //  types.ts

  hook({ data }: { data?: HookData }) {
    return this.sendMessage<HookResponse, HookError>({
      message: {
        messageName: "hook",
        data,
      },
      respondedToBy: "hookResponse", // @todo get these from hook-service.json
    });
  }
}
