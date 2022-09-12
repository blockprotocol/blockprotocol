import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { css, html } from "lit";

/**
 * This defines the properties of the entity your block expects to be sent.
 * This entity is available to your block on this.graph.blockEntity.
 * To change the structure of the entity your block expects, change this type.
 */
type BlockEntityProperties = {
  name: string;
};

/**
 * This is the entry point for your block – the class that embedding applications will use to register your element.
 * It is a function that takes a property object (known as "props" in React) and returns an element.
 * You should update this comment to describe what your block does, or remove the comment.
 */
export class BlockElement extends BlockElementBase<BlockEntityProperties> {
  /** @see https://lit.dev/docs/components/styles */
  static styles = css`
    font-family: sans-serif;
  `;

  private handleInput(event: Event) {
    /**
     * This is an example of using the graph service to send a message to the embedding application
     * – this particular message asks the application update an entity's properties.
     * The specific entity to update is identified by 'entityId'
     * – we are passing the 'entityId' of the entity loaded into the block (graph.blockEntity').
     *
     * Many other messages are available for your block to read and update entities, and links between entities
     * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions
     */
    this.graphService
      ?.updateEntity({
        data: {
          entityId: this.graph.blockEntity.entityId,
          properties: { name: (event.target as HTMLInputElement).value },
        },
      })
      .catch((error) => console.error(`Error updating self: ${error}`));
  }

  /** @see https://lit.dev/docs/components/rendering */
  render() {
    return html` <h1>Hello, ${this.graph.blockEntity?.properties.name}</h1>
      <p>
        The entityId of this block is ${this.graph.blockEntity?.entityId}. Use
        it to update its data when calling updateEntity.
      </p>
      <!-- @see https://lit.dev/docs/components/events -->
      <input
        @change=${this.handleInput}
        value=${this.graph.blockEntity?.properties.name}
      />`;
  }
}
