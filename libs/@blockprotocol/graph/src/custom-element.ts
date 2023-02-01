import { LitElement } from "lit";

import {
  BlockGraphProperties,
  Entity,
  EntityPropertiesObject,
  GraphBlockHandler,
  LinkEntityAndRightEntity,
} from "./index.js";
import { getOutgoingLinkAndTargetEntities } from "./stdlib.js";
import { getRoots } from "./stdlib/subgraph/roots.js";

export interface BlockElementBase<
  Temporal extends boolean,
  RootEntity extends Entity<Temporal> = Entity<Temporal>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is used in the class definition
  RootEntityLinkedEntities extends LinkEntityAndRightEntity<Temporal>[] = LinkEntityAndRightEntity<Temporal>[],
> extends LitElement,
    BlockGraphProperties<Temporal, RootEntity> {}

/**
 * A class to use as a base for implementing Block Protocol blocks as custom elements.
 * This class handles establishing communication with the embedding application.
 */
export abstract class BlockElementBase<
  Temporal extends boolean,
  RootEntity,
  RootEntityLinkedEntities,
> extends LitElement {
  /**
   * The 'graphService' is a handler for sending messages to the embedding application, e.g. 'graphService.updateEntity'
   * It starts off undefined and will be available once the initial exchange of messages has taken place (handled internally)
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list of available messages
   */
  protected graphService?: GraphBlockHandler<Temporal>;
  protected blockEntity?: RootEntity;
  protected linkedEntities?: LinkEntityAndRightEntity<Temporal>[];

  /**
   * The properties sent to the block represent the messages sent automatically from the application to the block.
   * All block <> application messages are split into services, and so is this property object.
   */
  static properties = {
    /**
     * The 'graph' object contains messages sent under the graph service from the app to the block.
     * They are sent on initialization and again when the application has new values to send.
     * One such message is 'graph.blockEntitySubgraph', which is a graph rooted at the block entity.
     * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list
     */
    graph: { type: Object },

    /**
     * These are properties derived from the block subgraph – the root entity, and those linked from it
     * // @see https://lit.dev/docs/components/properties/#internal-reactive-state
     */
    blockEntity: { state: true },
    linkedEntities: { state: true },
  };

  private updateDerivedProperties() {
    const blockEntitySubgraph = this.graph?.blockEntitySubgraph;

    if (blockEntitySubgraph) {
      const rootEntity = getRoots(blockEntitySubgraph)[0];
      if (!rootEntity) {
        throw new Error("Root entity not present in subgraph");
      }
      this.blockEntity = rootEntity;

      this.linkedEntities =
        getOutgoingLinkAndTargetEntities<RootEntityLinkedEntities>(
          blockEntitySubgraph,
          rootEntity.metadata.recordId.entityId,
        );
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.graphService || this.graphService.destroyed) {
      this.graphService = new GraphBlockHandler({
        callbacks: {
          blockEntitySubgraph: () => this.updateDerivedProperties(),
        },
        element: this,
      });
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
  protected updateSelfProperties(properties: EntityPropertiesObject) {
    if (!this.graphService) {
      throw new Error(
        "Cannot updateSelfProperties – graphService not yet connected.",
      );
    }
    if (!this.graph) {
      throw new Error(
        "Cannot update self: no 'graph' property object passed to block.",
      );
    } else if (!this.graph.blockEntitySubgraph) {
      throw new Error(
        "Cannot update self: no 'blockEntitySubgraph' on 'graph' object passed to block",
      );
    }

    const blockEntity = getRoots(this.graph.blockEntitySubgraph)[0];
    if (!blockEntity) {
      throw new Error(
        "Cannot update self: no root entity on graph.blockEntitySubgraph passed to block",
      );
    }

    return this.graphService.updateEntity({
      data: {
        entityId: blockEntity.metadata.recordId.entityId,
        entityTypeId: blockEntity.metadata.entityTypeId,
        properties,
        leftToRightOrder: blockEntity.linkData?.leftToRightOrder,
        rightToLeftOrder: blockEntity.linkData?.rightToLeftOrder,
      },
    });
  }
}
