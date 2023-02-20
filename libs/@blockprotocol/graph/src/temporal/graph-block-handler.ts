import { ModuleHandler } from "@blockprotocol/core";

import {
  AggregateEntitiesData as AggregateEntitiesDataGeneral,
  GetEntityData as GetEntityDataGeneral,
} from "../shared/types/entity";
/**
 * There's an issue when importing useGraphEmbedderModule from @blockprotocol/graph/react in hashintel/hash:
 * NextJS's output file tracing does not include graph-module.json, and yet an import statement for it is preserved.
 * This leads to a 'module cannot be found error'. For now, commenting out the import of the JSON from this file.
 * @todo restore this when module resolution issue resolved
 * @see https://app.asana.com/0/1202542409311090/1202614421149286/f
 */
// import graphModuleJson from "./graph-module.json" assert { type: "json" };
import {
  AggregateEntitiesResult,
  AggregateEntityTypesData,
  AggregateEntityTypesResult,
  BlockGraphMessageCallbacks,
  CreateEntityData,
  CreateResourceError,
  DeleteEntityData,
  Entity,
  EntityPropertiesObject,
  EntityRootType,
  EntityTypeRootType,
  GetEntityTypeData,
  GraphBlockMessages,
  ReadOrModifyResourceError,
  Subgraph,
  UpdateEntityData,
  UploadFileData,
  UploadFileReturn,
} from "./main.js";

/**
 * Creates a handler for the graph module for the block.
 * Register callbacks in the constructor or afterwards using the 'on' method to react to messages from the embedder.
 * Call the relevant methods to send messages to the embedder.
 */
export class GraphBlockHandler
  extends ModuleHandler
  implements
    Omit<
      GraphBlockMessages,
      | "createEntityType"
      | "updateEntityType"
      | "createPropertyType"
      | "updatePropertyType"
      | "getPropertyType"
      | "aggregatePropertyTypes"
    >
{
  constructor({
    callbacks,
    element,
  }: {
    callbacks?: Partial<BlockGraphMessageCallbacks>;
    element?: HTMLElement | null;
  }) {
    super({ element, callbacks, moduleName: "graph", sourceType: "block" });
  }

  getInitPayload(): Record<string, any> {
    // there are no block messages which are sentOnInitialization in the graph module
    return {};
  }

  /**
   * Registers multiple callbacks at once.
   * Useful for bulk updates to callbacks after the module is first initialised.
   */
  registerCallbacks(callbacks: Partial<BlockGraphMessageCallbacks>) {
    super.registerCallbacks(callbacks);
  }

  /**
   * Removes multiple callbacks at once.
   * Useful when replacing previously registered callbacks
   */
  removeCallbacks(callbacks: Partial<BlockGraphMessageCallbacks>) {
    super.removeCallbacks(callbacks);
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

  // @todo automate creation of these methods from graph-module.json and types.ts

  createEntity<
    ValidProperties extends EntityPropertiesObject = EntityPropertiesObject,
  >({ data }: { data?: CreateEntityData & { properties: ValidProperties } }) {
    return this.sendMessage<Entity, CreateResourceError>({
      message: {
        messageName: "createEntity",
        data,
      },
      respondedToBy: "createEntityResponse", // @todo get these from graph-module.json
    });
  }

  updateEntity<
    ValidProperties extends EntityPropertiesObject = EntityPropertiesObject,
  >({ data }: { data?: UpdateEntityData & { properties: ValidProperties } }) {
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

  getEntity({ data }: { data?: GetEntityDataGeneral<boolean> }) {
    return this.sendMessage<
      Subgraph<EntityRootType>,
      ReadOrModifyResourceError
    >({
      message: {
        messageName: "getEntity",
        data,
      },
      respondedToBy: "getEntityResponse",
    });
  }

  aggregateEntities({
    data,
  }: {
    data?: AggregateEntitiesDataGeneral<boolean>;
  }) {
    return this.sendMessage<
      AggregateEntitiesResult<Subgraph<EntityRootType>>,
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
  //     respondedToBy: "createEntityTypeResponse", // @todo get this from graph-module.json
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
      Subgraph<EntityTypeRootType>,
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
      AggregateEntityTypesResult<Subgraph<EntityTypeRootType>>,
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
