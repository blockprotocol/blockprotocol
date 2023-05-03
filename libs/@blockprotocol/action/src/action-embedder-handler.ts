import { ModuleHandler } from "@blockprotocol/core";

import {
  ActionBlockMessages,
  ActionEmbedderMessages,
  AvailableActionsData,
  UpdateActionData,
  UpdateActionError,
} from "./types.js";

/**
 * Creates a handler for the action module for the embedder.
 * Register callbacks in the constructor or afterwards using the 'on' method to
 * react to messages from the block. Call the relevant methods to send messages
 * to the block.
 */
export class ActionEmbedderHandler
  extends ModuleHandler
  implements ActionEmbedderMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<ActionBlockMessages>;
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, moduleName: "action", sourceType: "embedder" });
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
  on<K extends keyof ActionBlockMessages>(
    this: ActionEmbedderHandler,
    messageName: K,
    handlerFunction: NonNullable<ActionBlockMessages[K]>,
  ) {
    this.registerCallback({
      callback: handlerFunction,
      messageName,
    });
  }

  getInitPayload(this: ActionEmbedderHandler): Record<string, any> {
    return {};
  }

  updateAction({ data }: { data?: UpdateActionData }) {
    return this.sendMessage<AvailableActionsData, UpdateActionError>({
      message: {
        messageName: "updateAction",
        data,
      },
      respondedToBy: "availableActions",
    });
  }
}
