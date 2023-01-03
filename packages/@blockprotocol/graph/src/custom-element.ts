import { LitElement } from "lit";

import {
  BlockGraphProperties,
  EntityPropertiesObject,
  GraphBlockHandler,
  LinkEntityAndRightEntity,
  SubgraphRootTypes,
} from "./index.js";
import { getOutgoingLinkAndTargetEntities } from "./stdlib";
import { getRoots } from "./stdlib/subgraph/roots.js";

export interface BlockElementBase<
  RootType extends SubgraphRootTypes["entity"] = SubgraphRootTypes["entity"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is used in the class definition
  RootEntityLinkedEntities extends LinkEntityAndRightEntity[] = LinkEntityAndRightEntity[],
> extends LitElement,
    BlockGraphProperties<RootType> {}

/**
 * A class to use as a base for implementing Block Protocol blocks as custom elements.
 * This class handles establishing communication with the embedding application.
 */
export abstract class BlockElementBase<
  RootType,
  RootEntityLinkedEntities,
> extends LitElement {
  /**
   * The 'graphService' is a handler for sending messages to the embedding application, e.g. 'graphService.updateEntity'
   * It starts off undefined and will be available once the initial exchange of messages has taken place (handled internally)
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for a full list of available messages
   */
  protected graphService?: GraphBlockHandler;
  protected blockEntity?: RootType["element"];
  protected linkedEntities?: LinkEntityAndRightEntity[];

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
    rootEntity: { type: Object },
  };

  connectedCallback() {
    super.connectedCallback();
    if (!this.graphService || this.graphService.destroyed) {
      this.graphService = new GraphBlockHandler({ element: this });
    }

    const blockEntitySubgraph = this.graph?.blockEntitySubgraph;

    if (blockEntitySubgraph) {
      const rootEntity = getRoots<RootType>(blockEntitySubgraph)[0];
      if (!rootEntity) {
        throw new Error("Root entity not present in subgraph");
      }
      this.blockEntity = rootEntity;

      this.linkedEntities =
        getOutgoingLinkAndTargetEntities<RootEntityLinkedEntities>(
          blockEntitySubgraph,
          rootEntity.metadata.editionId.baseId,
        );
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
        entityId: blockEntity.metadata.editionId.baseId,
        entityTypeId: blockEntity.metadata.entityTypeId,
        properties,
        leftToRightOrder: blockEntity.linkData?.leftToRightOrder,
        rightToLeftOrder: blockEntity.linkData?.rightToLeftOrder,
      },
    });
  }
}
