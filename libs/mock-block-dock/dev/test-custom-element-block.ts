import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { extractBaseUri } from "@blockprotocol/type-system/slim";
// eslint-disable-next-line import/no-extraneous-dependencies
import { html } from "lit";

import { propertyTypes } from "../src/data/property-types";

export class TestCustomElementBlock extends BlockElementBase<true> {
  private handleInput(event: Event) {
    this.updateSelfProperties({
      [extractBaseUri(propertyTypes.name.$id)]: (
        event.target as HTMLInputElement
      ).value,
    })
      // eslint-disable-next-line no-console -- intentional debugging tool
      .then(console.log)
      .catch(
        // eslint-disable-next-line no-console -- intentional debugging tool
        (err) => console.error(`Error updating self: ${err}`),
      );
  }

  render() {
    const blockEntity = this.graph?.blockEntitySubgraph
      ? getRoots(this.graph.blockEntitySubgraph)[0]!
      : undefined;
    if (this.graph.readonly) {
      return html`<h1>
          Hello,
          ${blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}
        </h1>
        <p>
          The entityId of this block is
          ${blockEntity?.metadata.recordId.entityId}.
        </p>
        <p>
          ${blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}
        </p>`;
    }

    return html`<h1>
        Hello,
        ${blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}
      </h1>
      <p>
        The entityId of this block is
        ${blockEntity?.metadata.recordId.entityId}. Use it to update its data
        when calling updateEntities.
      </p>
      <input
        @change=${this.handleInput}
        value=${blockEntity?.properties[extractBaseUri(propertyTypes.name.$id)]}
      />`;
  }
}
