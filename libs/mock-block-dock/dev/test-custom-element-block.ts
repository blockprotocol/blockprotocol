import { extractBaseUrl } from "@blockprotocol/graph";
import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { HookBlockHandler } from "@blockprotocol/hook";
import { html } from "lit";

import { propertyTypes } from "../src/data/property-types";

const paragraphId = "hook-paragraph";

export class TestCustomElementBlock extends BlockElementBase {
  private hookModule?: HookBlockHandler;

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    if (!this.hookModule || this.hookModule.destroyed) {
      this.hookModule = new HookBlockHandler({
        element: this,
      });
    }

    const paragraph = this.renderRoot.querySelector(`#${paragraphId}`);
    if (!paragraph || !(paragraph instanceof HTMLParagraphElement)) {
      throw new Error("No paragraph for hook module found in element DOM");
    }

    void this.hookModule.hook({
      data: {
        node: paragraph,
        entityId: this.getBlockEntity()?.metadata.recordId.entityId,
        hookId: null,
        path: [extractBaseUrl(propertyTypes.description.$id)],
        type: "text",
      },
    });
  }

  private handleInput(event: Event) {
    this.updateSelfProperties({
      [extractBaseUrl(propertyTypes.name.$id)]: (
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
          ${blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)]}
        </h1>
        <p>
          The entityId of this block is
          ${blockEntity?.metadata.recordId.entityId}.
        </p>
        <p>
          ${blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)]}
        </p>`;
    }

    return html`<h1>
        Hello,
        ${blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)]}
      </h1>
      <p>
        The entityId of this block is
        ${blockEntity?.metadata.recordId.entityId}. Use it to update its data
        when calling updateEntities.
      </p>
      <input
        @change=${this.handleInput}
        value=${blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)]}
      />
      <h2>Hook-handled description display</h2>
      <p id="hook-paragraph" />`;
  }
}
