import { ServiceHandler } from "@blockprotocol/core";

// @todo restore this when an issue with module resolution has been resolved
// import graphServiceJson from "./graph-service.json" assert { type: "json" };
import {
  BlockGraph,
  EmbedderGraphMessageCallbacks,
  EmbedderGraphMessages,
  Entity,
  EntityType,
  LinkedAggregations,
} from "./types.js";

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
  private _entityTypes?: EntityType[];
  private _linkedAggregations?: LinkedAggregations;
  private _readonly?: boolean;

  constructor({
    blockEntity,
    blockGraph,
    callbacks,
    element,
    entityTypes,
    linkedAggregations,
    readonly,
  }: {
    blockEntity?: Entity;
    blockGraph?: BlockGraph;
    callbacks?: Partial<EmbedderGraphMessageCallbacks>;
    element?: HTMLElement | null;
    entityTypes?: EntityType[];
    linkedAggregations?: LinkedAggregations;
    readonly?: boolean;
  }) {
    super({ element, serviceName: "graph", sourceType: "embedder" });
    this._blockEntity = blockEntity;
    this._blockGraph = blockGraph;
    this._entityTypes = entityTypes;
    this._linkedAggregations = linkedAggregations;
    this._readonly = readonly;

    if (callbacks) {
      this.registerCallbacks(callbacks);
    }
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the service is first initialised.
   */
  registerCallbacks(callbacks: Partial<EmbedderGraphMessageCallbacks>) {
    super.registerCallbacks(callbacks);
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
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "block";
    // const messageJsonDefinition = graphServiceJson.messages.find(
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

  getInitPayload(this: GraphEmbedderHandler): Record<string, any> {
    return {
      blockEntity: this._blockEntity,
      blockGraph: this._blockGraph,
      linkedAggregations: this._linkedAggregations,
      readonly: this._readonly,
    };
  }

  blockEntity({ data }: { data?: Entity }) {
    this._blockEntity = data;
    this.sendMessage({
      message: {
        messageName: "blockEntity",
        data: this._blockEntity,
      },
    });
  }

  blockGraph({ data }: { data?: BlockGraph }) {
    this._blockGraph = data;
    this.sendMessage({
      message: {
        messageName: "blockGraph",
        data: this._blockGraph,
      },
    });
  }

  entityTypes({ data }: { data?: EntityType[] }) {
    this._entityTypes = data;
    this.sendMessage({
      message: {
        messageName: "entityTypes",
        data: this._entityTypes,
      },
    });
  }

  linkedAggregations({ data }: { data?: LinkedAggregations }) {
    this._linkedAggregations = data;
    this.sendMessage({
      message: {
        messageName: "linkedAggregations",
        data: this._linkedAggregations,
      },
    });
  }

  readonly({ data }: { data?: boolean }) {
    this._readonly = !!data;
    this.sendMessage({
      message: {
        messageName: "readonly",
        data: this._readonly,
      },
    });
  }
}
