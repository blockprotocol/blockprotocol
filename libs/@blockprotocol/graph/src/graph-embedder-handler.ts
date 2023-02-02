import { ServiceHandler } from "@blockprotocol/core";

// @todo restore this when an issue with module resolution has been resolved
// import graphServiceJson from "./graph-service.json" assert { type: "json" };
import {
  EmbedderGraphMessageCallbacks,
  EmbedderGraphMessages,
  EntityRootType,
  Subgraph,
} from "./types.js";

/**
 * Creates a handler for the graph service for the embedder.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the block.
 * Call the relevant methods to send messages to the block.
 */
export class GraphEmbedderHandler<Temporal extends boolean>
  extends ServiceHandler
  implements EmbedderGraphMessages<Temporal>
{
  private _blockEntitySubgraph?: Subgraph<Temporal, EntityRootType<Temporal>>;
  // private _linkedAggregations?: LinkedAggregations;
  private _readonly?: boolean;

  constructor({
    blockEntitySubgraph,
    callbacks,
    element,
    // linkedAggregations,
    readonly,
  }: {
    blockEntitySubgraph?: Subgraph<Temporal, EntityRootType<Temporal>>;
    callbacks?: Partial<EmbedderGraphMessageCallbacks<Temporal>>;
    element?: HTMLElement | null;
    // linkedAggregations?: LinkedAggregations;
    readonly?: boolean;
  }) {
    super({ element, callbacks, serviceName: "graph", sourceType: "embedder" });
    this._blockEntitySubgraph = blockEntitySubgraph;
    // this._linkedAggregations = linkedAggregations;
    this._readonly = readonly;
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the service is first initialised.
   */
  registerCallbacks(
    callbacks: Partial<EmbedderGraphMessageCallbacks<Temporal>>,
  ) {
    super.registerCallbacks(callbacks);
  }

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  on<K extends keyof EmbedderGraphMessageCallbacks<Temporal>>(
    this: GraphEmbedderHandler<Temporal>,
    messageName: K,
    handlerFunction: NonNullable<EmbedderGraphMessageCallbacks<Temporal>[K]>,
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

  getInitPayload(this: GraphEmbedderHandler<Temporal>): Record<string, any> {
    return {
      blockEntitySubgraph: this._blockEntitySubgraph,
      // linkedAggregations: this._linkedAggregations,
      readonly: this._readonly,
    };
  }

  async blockEntitySubgraph({
    data,
  }: {
    data?: Subgraph<Temporal, EntityRootType<Temporal>>;
  }) {
    this._blockEntitySubgraph = data;
    this.sendMessage({
      message: {
        messageName: "blockEntitySubgraph",
        data: this._blockEntitySubgraph,
      },
    });

    return {
      data: null,
    };
  }

  // linkedAggregations({ data }: { data?: LinkedAggregations }) {
  //   this._linkedAggregations = data;
  //   this.sendMessage({
  //     message: {
  //       messageName: "linkedAggregations",
  //       data: this._linkedAggregations,
  //     },
  //   });
  // }

  async readonly({ data }: { data?: boolean }) {
    this._readonly = data;
    this.sendMessage({
      message: {
        messageName: "readonly",
        data: this._readonly,
      },
    });

    return {
      data: null,
    };
  }
}
