import { ModuleHandler } from "@blockprotocol/core";

import {
  ActionBlockMessages,
  ActionData,
  ActionEmbedderMessages,
  AvailableActionsData,
} from "./types.js";

/**
 * Creates a handler for the action module for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to
 * react to messages from the embedder. Call the relevant methods to send
 * messages to the embedder.
 */
export class ActionBlockHandler
  extends ModuleHandler
  implements ActionBlockMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<ActionEmbedderMessages>;
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, moduleName: "action", sourceType: "block" });
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the action module
    return {};
  }

  on<K extends keyof ActionEmbedderMessages>(
    this: ActionBlockHandler,
    messageName: K,
    handlerFunction: ActionEmbedderMessages[K],
  ) {
    this.registerCallback({
      callback: handlerFunction,
      messageName,
    });
  }

  action({ data }: { data?: ActionData }) {
    return this.sendMessage({
      message: {
        messageName: "action",
        data,
      },
    });
  }

  availableActions({ data }: { data?: AvailableActionsData }) {
    return this.sendMessage({
      message: {
        messageName: "availableActions",
        data,
      },
    });
  }
}
