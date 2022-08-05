import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { css, html } from "lit";

/**
 * Define the properties the block expects to be passed.
 * They will be provided under this.graph.blockEntity.properties.
 */
type BlockEntityProperties = {
  name: string;
};

export class BlockElement extends BlockElementBase<BlockEntityProperties> {
  /** @see https://lit.dev/docs/components/styles */
  static styles = css`
    font-family: sans-serif;
  `;

  private handleInput(event: Event) {
    this.updateSelf({ name: (event.target as HTMLInputElement).value }).catch(
      (error) => console.error(`Error updating self: ${error}`),
    );
  }

  /** @see https://lit.dev/docs/components/rendering */
  render() {
    return html` <h1>Hello, ${this.blockEntity.properties.name}</h1>
      <p>
        The entityId of this block is ${this.blockEntity.entityId}. Use it to
        update its data when calling updateEntity.
      </p>
      <!-- @see https://lit.dev/docs/components/events -->
      <input
        @change=${this.handleInput}
        value=${this.blockEntity.properties.name}
      />`;
  }
}
