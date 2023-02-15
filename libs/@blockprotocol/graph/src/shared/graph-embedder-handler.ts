import { ModuleHandler } from "@blockprotocol/core";

// @todo restore this when an issue with module resolution has been resolved
// import graphModuleJson from "./graph-module.json" assert { type: "json" };
import {
  EntityRootType,
  GraphEmbedderMessageCallbacks,
  GraphEmbedderMessages,
  Subgraph,
} from "./types.js";

/**
 * Creates a handler for the graph module for the embedder.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the block.
 * Call the relevant methods to send messages to the block.
 */
export class GraphEmbedderHandler<Temporal extends boolean>
  extends ModuleHandler
  implements GraphEmbedderMessages<Temporal>
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
    callbacks?: Partial<GraphEmbedderMessageCallbacks<Temporal>>;
    element?: HTMLElement | null;
    // linkedAggregations?: LinkedAggregations;
    readonly?: boolean;
  }) {
    super({ element, callbacks, moduleName: "graph", sourceType: "embedder" });
    this._blockEntitySubgraph = blockEntitySubgraph;
    // this._linkedAggregations = linkedAggregations;
    this._readonly = readonly;
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the module is first initialised.
   */
  registerCallbacks(
    callbacks: Partial<GraphEmbedderMessageCallbacks<Temporal>>,
  ) {
    super.registerCallbacks(callbacks);
  }

  /**
   * Removes multiple callbacks at once.
   * Useful when replacing previously registered callbacks
   */
  removeCallbacks(callbacks: Partial<GraphEmbedderMessageCallbacks<Temporal>>) {
    super.removeCallbacks(callbacks);
  }

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  on<K extends keyof GraphEmbedderMessageCallbacks<Temporal>>(
    this: GraphEmbedderHandler<Temporal>,
    messageName: K,
    handlerFunction: NonNullable<GraphEmbedderMessageCallbacks<Temporal>[K]>,
  ) {
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "block";
    // const messageJsonDefinition = graphModuleJson.messages.find(
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

  blockEntitySubgraph({
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

  readonly({ data }: { data?: boolean }) {
    this._readonly = data;
    this.sendMessage({
      message: {
        messageName: "readonly",
        data: this._readonly,
      },
    });
  }
}
