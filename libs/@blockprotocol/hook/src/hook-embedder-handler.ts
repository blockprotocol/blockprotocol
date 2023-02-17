import { ModuleHandler } from "@blockprotocol/core";

// @todo restore this when an issue with module resolution has been resolved
// import hookModuleJson from "./hook-module.json" assert { type: "json" };
import { HookEmbedderMessageCallbacks, HookEmbedderMessages } from "./types.js";

/**
 * Creates a handler for the hook module for the embedder.
 * Register callbacks in the constructor or afterwards using the 'on' method to
 * react to messages from the block. Call the relevant methods to send messages
 * to the block.
 */
export class HookEmbedderHandler
  extends ModuleHandler
  implements HookEmbedderMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<HookEmbedderMessageCallbacks>;
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, moduleName: "hook", sourceType: "embedder" });
  }

  /**
   * Call the provided function when the named message is received, passing the
   * data/errors object from the message. If the named message expects a
   * response, the callback should provide the expected data/errors object as
   * the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received,
   *   with the message data / errors
   */
  on<K extends keyof HookEmbedderMessageCallbacks>(
    this: HookEmbedderHandler,
    messageName: K,
    handlerFunction: NonNullable<HookEmbedderMessageCallbacks[K]>,
  ) {
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "block";
    // const messageJsonDefinition = hookModuleJson.messages.find(
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

  getInitPayload(this: HookEmbedderHandler): Record<string, any> {
    return {};
  }
}
