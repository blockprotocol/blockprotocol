import { ServiceHandler } from "@blockprotocol/core";

/**
 * There's an issue when importing useGraphEmbedderService from @blockprotocol/graph/react in hashintel/hash:
 * NextJS's output file tracing does not include graph-service.json, and yet an import statement for it is preserved.
 * This leads to a 'module cannot be found error'. For now, commenting out the import of the JSON from this file.
 * @todo restore this when module resolution issue resolved
 * @see https://app.asana.com/0/1202542409311090/1202614421149286/f
 */
// import graphServiceJson from "./graph-service.json" assert { type: "json" };
import {
  AggregateEntitiesData,
  AggregateEntitiesResult,
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  BlockGraphMessageCallbacks,
  BlockGraphMessages,
  CreateEntityData,
  CreateResourceError,
  DeleteEntityData,
  Entity,
  GetEntityData,
  GetEntityTypeData,
  ReadOrModifyResourceError,
  Subgraph,
  SubgraphRootTypes,
  UpdateEntityData,
  UploadFileData,
  UploadFileReturn,
} from "./types.js";

/**
 * Creates a handler for the graph service for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the embedder.
 * Call the relevant methods to send messages to the embedder.
 */
export class GraphBlockHandler
  extends ServiceHandler
  implements BlockGraphMessages
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<BlockGraphMessageCallbacks>;
    element: HTMLElement;
  }) {
    super({ element, serviceName: "graph", sourceType: "block" });
    if (callbacks) {
      this.registerCallbacks(callbacks);
    }
    this.coreHandler.initialize();
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the graph service
    return {};
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the service is first initialised.
   */
  registerCallbacks(callbacks: Partial<BlockGraphMessageCallbacks>) {
    super.registerCallbacks(callbacks);
  }

  /**
   * Call the provided function when the named message is received, passing the data/errors object from the message.
   * If the named message expects a response, the callback should provide the expected data/errors object as the return.
   * @param messageName the message name to listen for
   * @param handlerFunction the function to call when the message is received, with the message data / errors
   */
  on<K extends keyof BlockGraphMessageCallbacks>(
    this: GraphBlockHandler,
    messageName: K,
    handlerFunction: BlockGraphMessageCallbacks[K],
  ) {
    // @todo restore this when module resolution issue resolved
    // @see https://app.asana.com/0/1202542409311090/1202614421149286/f
    // const expectedMessageSource = "embedder";
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

  // @todo automate creation of these methods from graph-service.json and types.ts

  createEntity({ data }: { data?: CreateEntityData }) {
    return this.sendMessage<Entity, CreateResourceError>({
      message: {
        messageName: "createEntity",
        data,
      },
      respondedToBy: "createEntityResponse", // @todo get these from graph-service.json
    });
  }

  updateEntity({ data }: { data?: UpdateEntityData }) {
    return this.sendMessage<Entity, ReadOrModifyResourceError>({
      message: {
        messageName: "updateEntity",
        data,
      },
      respondedToBy: "updateEntityResponse",
    });
  }

  deleteEntity({ data }: { data?: DeleteEntityData }) {
    // @todo fix this 'any'
    return this.sendMessage<any, ReadOrModifyResourceError>({
      message: {
        messageName: "deleteEntity",
        data,
      },
      respondedToBy: "deleteEntityResponse",
    });
  }

  getEntity({ data }: { data?: GetEntityData }) {
    return this.sendMessage<
      Subgraph<SubgraphRootTypes["entity"]>,
      ReadOrModifyResourceError
    >({
      message: {
        messageName: "getEntity",
        data,
      },
      respondedToBy: "getEntityResponse",
    });
  }

  aggregateEntities({ data }: { data?: AggregateEntitiesData }) {
    return this.sendMessage<
      AggregateEntitiesResult<Subgraph<SubgraphRootTypes["entity"]>>,
      ReadOrModifyResourceError
    >({
      message: {
        messageName: "aggregateEntities",
        data,
      },
      respondedToBy: "aggregateEntitiesResponse",
    });
  }

  /** @todo - Add Type System mutation methods */
  // createEntityType({ data }: { data?: CreateEntityTypeData }) {
  //   return this.sendMessage<EntityType, CreateResourceError>({
  //     message: {
  //       messageName: "createEntityType",
  //       data,
  //     },
  //     respondedToBy: "createEntityTypeResponse", // @todo get this from graph-service.json
  //   });
  // }
  //
  // updateEntityType({ data }: { data?: UpdateEntityTypeData }) {
  //   return this.sendMessage<EntityType, ReadOrModifyResourceError>({
  //     message: {
  //       messageName: "updateEntityType",
  //       data,
  //     },
  //     respondedToBy: "updateEntityTypeResponse",
  //   });
  // }
  //
  // deleteEntityType({ data }: { data?: DeleteEntityTypeData }) {
  //   // @todo fix this 'any'
  //   return this.sendMessage<any, ReadOrModifyResourceError>({
  //     message: {
  //       messageName: "deleteEntityType",
  //       data,
  //     },
  //     respondedToBy: "deleteEntityTypeResponse",
  //   });
  // }

  getEntityType({ data }: { data?: GetEntityTypeData }) {
    return this.sendMessage<
      Subgraph<SubgraphRootTypes["entityType"]>,
      ReadOrModifyResourceError
    >({
      message: {
        messageName: "getEntityType",
        data,
      },
      respondedToBy: "getEntityTypeResponse",
    });
  }

  aggregateEntityTypes({ data }: { data?: AggregateEntityTypesData }) {
    return this.sendMessage<
      AggregateEntityTypesResult<Subgraph<SubgraphRootTypes["entityType"]>>,
      ReadOrModifyResourceError
    >({
      message: {
        messageName: "aggregateEntityTypes",
        data,
      },
      respondedToBy: "aggregateEntityTypesResponse",
    });
  }

  /** @todo - Reimplement linked aggregations */
  // createLinkedAggregation({ data }: { data?: CreateLinkedAggregationData }) {
  //   return this.sendMessage<LinkedAggregation, CreateResourceError>({
  //     message: {
  //       messageName: "createLinkedAggregation",
  //       data,
  //     },
  //     respondedToBy: "createLinkedAggregationResponse",
  //   });
  // }
  //
  // updateLinkedAggregation({ data }: { data?: UpdateLinkedAggregationData }) {
  //   return this.sendMessage<LinkedAggregation, ReadOrModifyResourceError>({
  //     message: {
  //       messageName: "updateLinkedAggregation",
  //       data,
  //     },
  //     respondedToBy: "updateLinkedAggregationResponse",
  //   });
  // }
  //
  // deleteLinkedAggregation({ data }: { data?: DeleteLinkedAggregationData }) {
  //   // @todo fix this 'any'
  //   return this.sendMessage<any, ReadOrModifyResourceError>({
  //     message: {
  //       messageName: "deleteLinkedAggregation",
  //       data,
  //     },
  //     respondedToBy: "deleteLinkedAggregationResponse",
  //   });
  // }
  //
  // getLinkedAggregation({ data }: { data?: GetLinkedAggregationData }) {
  //   return this.sendMessage<LinkedAggregation, ReadOrModifyResourceError>({
  //     message: {
  //       messageName: "getLinkedAggregation",
  //       data,
  //     },
  //     respondedToBy: "getLinkedAggregationResponse",
  //   });
  // }

  uploadFile({ data }: { data?: UploadFileData }) {
    return this.sendMessage<UploadFileReturn, CreateResourceError>({
      message: {
        messageName: "uploadFile",
        data,
      },
      respondedToBy: "uploadFileResponse",
    });
  }
}
