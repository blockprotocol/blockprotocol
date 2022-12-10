import { LitElement } from "lit";

import {
  BlockGraphProperties,
  EntityPropertiesObject,
  GraphBlockHandler,
} from "./index.js";

export interface BlockElementBase<
  BlockEntityProperties extends EntityPropertiesObject | null,
> extends LitElement,
    BlockGraphProperties<BlockEntityProperties> {}

/**
 * A class to use as a base for implementing Block Protocol blocks as custom elements.
 * This class handles establishing communication with the embedding application.
 */
export abstract class BlockElementBase<
  BlockEntityProperties extends EntityPropertiesObject | null,
> extends LitElement {
  /**
   * The 'graphService' is a handler for sending messages to the embedding application, e.g. 'graphService.updateEntity'
   * It starts off undefined and will be available once the initial exchange of messages has taken place (handled internally)
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list of available messages
   */
  protected graphService?: GraphBlockHandler;

  /**
   * The properties sent to the block represent the messages sent automatically from the application to the block.
   * All block <> application messages are split into services, and so is this property object.
   */
  static properties = {
    /**
     * The 'graph' object contains messages sent under the graph service from the app to the block.
     * They are sent on initialization and again when the application has new values to send.
     * One such message is 'graph.blockEntity', which is a data entity fitting the block's schema (its type).
     * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list
     */
    graph: { type: Object },
  };

  connectedCallback() {
    super.connectedCallback();
    if (!this.graphService || this.graphService.destroyed) {
      this.graphService = new GraphBlockHandler({ element: this });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.graphService && !this.graphService.destroyed) {
      this.graphService.destroy();
    }
  }

  /**
   * A helper method to update the properties of the entity loaded into the block, i.e. this.graph.blockEntity
   * @param properties the properties object to assign to the entity, which will overwrite the existing object
   */
  protected updateSelf(properties: NonNullable<BlockEntityProperties>) {
    if (!this.graphService) {
      throw new Error("Cannot updateSelf – graphService not yet connected.");
    }
    if (!this.graph) {
      throw new Error(
        "Cannot update self: no 'graph' property object passed to block.",
      );
    } else if (!this.graph.blockEntity) {
      throw new Error(
        "Cannot update self: no 'blockEntity' on 'graph' object passed to block",
      );
    } else if (!this.graph.blockEntity.metadata) {
      throw new Error(
        "Cannot update self: no 'metadata' on graph.blockEntity passed to block",
      );
    }

    return this.graphService.updateEntity({
      data: {
        entityId: this.graph.blockEntity.metadata.editionId.baseId,
        properties,
      },
    });
  }
}
