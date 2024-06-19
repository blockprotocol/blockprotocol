import { ModuleHandler } from "@blockprotocol/core";

// @todo restore this when module resolution issue resolved
// import hookModuleDefinition from "./hook-module.json";
import {
  HookBlockMessageCallbacks,
  HookBlockMessages,
  HookData,
  HookError,
  HookResponse,
} from "./types.js";

/**
 * Creates a handler for the hook module for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to
 * react to messages from the embedder. Call the relevant methods to send
 * messages to the embedder.
 */
export class HookBlockHandler
  extends ModuleHandler
  implements HookBlockMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<HookBlockMessageCallbacks>;
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, moduleName: "hook", sourceType: "block" });
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the hook
    // module
    return {};
  }

  on<K extends keyof HookBlockMessageCallbacks>(
    this: HookBlockHandler,
    messageName: K,
    handlerFunction: HookBlockMessageCallbacks[K],
  ) {
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "embedder";
    // const messageJsonDefinition = hookModuleDefinition.messages.find(
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

  // @todo automate creation of these methods from hook-module.json and
  //  types.ts

  hook({ data }: { data?: HookData }) {
    return this.sendMessage<HookResponse, HookError>({
      message: {
        messageName: "hook",
        data,
      },
      respondedToBy: "hookResponse", // @todo get these from hook-module.json
    });
  }
}
