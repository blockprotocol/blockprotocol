import { ServiceHandler } from "@blockprotocol/core";

import serviceJsonDefinition from "./graph-service.json";
import {
  BlockGraph,
  EmbedderGraphMessageCallbacks,
  EmbedderGraphMessages,
  Entity,
  LinkedAggregations,
} from "./types";

/**
 * Creates a handler for the graph service for the embedder.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the block.
 * Call the relevant methods to send messages to the block.
 */
export class GraphEmbedderHandler
  extends ServiceHandler
  implements EmbedderGraphMessages
{
  private _blockEntity?: Entity;
  private _blockGraph?: BlockGraph;
  private _linkedAggregations?: LinkedAggregations;

  constructor({
    blockEntity,
    blockGraph,
    callbacks,
    element,
    linkedAggregations,
  }: {
    blockEntity?: Entity;
    blockGraph?: BlockGraph;
    callbacks?: EmbedderGraphMessageCallbacks;
    element: HTMLElement;
    linkedAggregations?: LinkedAggregations;
  }) {
    super({ element, serviceName: "graph", sourceType: "embedder" });
    this._blockEntity = blockEntity;
    this._linkedAggregations = linkedAggregations;
    this._blockGraph = blockGraph;

    if (callbacks) {
      this.registerCallbacks(callbacks);
    }
  }

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  on<K extends keyof EmbedderGraphMessageCallbacks>(
    this: GraphEmbedderHandler,
    messageName: K,
    handlerFunction: NonNullable<EmbedderGraphMessageCallbacks[K]>,
  ) {
    const expectedMessageSource = "block";
    const messageJsonDefinition = serviceJsonDefinition.messages.find(
      (message) =>
        message.name === messageName &&
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

  getInitPayload(this: GraphEmbedderHandler): Record<string, any> {
    return {
      blockEntity: this.blockEntity,
      blockGraph: this.blockGraph,
      linkedAggregations: this.linkedAggregations,
    };
  }

  blockEntity({ data }: { data?: Entity }) {
    this._blockEntity = data;
    void this.sendMessage({
      message: {
        messageName: "blockEntity",
        data: this.blockEntity,
      },
    });
  }

  blockGraph({ data }: { data?: BlockGraph }) {
    this._blockGraph = data;
    void this.sendMessage({
      message: {
        messageName: "blockGraph",
        data: this.blockGraph,
      },
    });
  }

  linkedAggregations({ data }: { data?: LinkedAggregations }) {
    this._linkedAggregations = data;
    void this.sendMessage({
      message: {
        messageName: "linkedAggregations",
        data: this.linkedAggregations,
      },
    });
  }
}
