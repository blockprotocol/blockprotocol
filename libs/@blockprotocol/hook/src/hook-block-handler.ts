import { ServiceHandler } from "@blockprotocol/core";

// @todo restore this when module resolution issue resolved
// import hookServiceDefinition from "./hook-service.json";
import {
  BlockHookMessageCallbacks,
  BlockHookMessages,
  HookData,
  HookError,
  HookResponse,
} from "./types.js";

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
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, serviceName: "hook", sourceType: "block" });
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
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "embedder";
    // const messageJsonDefinition = hookServiceDefinition.messages.find(
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
