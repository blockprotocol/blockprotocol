import { LitElement } from "lit";

import {
  BlockGraphProperties,
  GraphBlockHandler,
  UpdateEntityData,
} from "./index";

export interface BlockElementBase<
  BlockEntityProperties extends Record<string, unknown> | null,
> extends LitElement,
    BlockGraphProperties<BlockEntityProperties> {}

export abstract class BlockElementBase<
  BlockEntityProperties extends Record<string, unknown> | null,
> extends LitElement {
  protected graphService?: GraphBlockHandler;

  static properties = {
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
   * Alias for this.graph.blockEntity
   */
  protected get blockEntity():
    | BlockGraphProperties<BlockEntityProperties>["graph"]["blockEntity"]
    | undefined {
    return this.graph?.blockEntity;
  }

  /**
   * Update the properties of the entity loaded into the block, i.e. this.graph.blockEntity
   * @param properties the properties to update, which will be merged with any others
   */
  protected updateSelf(properties: UpdateEntityData["properties"]) {
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
    } else if (!this.graph.blockEntity.entityId) {
      throw new Error(
        "Cannot update self: no 'entityId' on graph.blockEntity passed to block",
      );
    }

    return this.graphService.updateEntity({
      data: { entityId: this.graph.blockEntity.entityId, properties },
    });
  }
}
