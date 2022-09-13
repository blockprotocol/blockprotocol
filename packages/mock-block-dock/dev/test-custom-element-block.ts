import { BlockElementBase } from "@blockprotocol/graph/custom-element";
// eslint-disable-next-line import/no-extraneous-dependencies
import { html } from "lit";

type BlockEntityProperties = {
  name: string;
};

export class TestCustomElementBlock extends BlockElementBase<BlockEntityProperties> {
  private handleInput(event: Event) {
    this.updateSelf({ name: (event.target as HTMLInputElement).value })
      // eslint-disable-next-line no-console -- intentional debugging tool
      .then(console.log)
      .catch(
        // eslint-disable-next-line no-console -- intentional debugging tool
        (err) => console.error(`Error updating self: ${err}`),
      );
  }

  render() {
    return html`<h1>Hello, ${this.graph.blockEntity?.properties.name}</h1>
      <p>
        The entityId of this block is ${this.graph.blockEntity?.entityId}. Use
        it to update its data when calling updateEntities.
      </p>
      <p style="display: ${this.graph.readonly ? "block" : "none"}">
        ${this.graph.blockEntity?.properties.name}
      </p>
      <input
        style="display: ${this.graph.readonly ? "none" : "block"}"
        @change=${this.handleInput}
        value=${this.graph.blockEntity?.properties.name}
      />`;
  }
}
