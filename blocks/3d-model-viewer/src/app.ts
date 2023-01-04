import "@google/model-viewer";

import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { addSimpleAccessors } from "@blockprotocol/graph/stdlib";
import { css, html } from "lit";

import { RootType } from "./types.gen";

export class BlockElement extends BlockElementBase<RootType> {
  /** @see https://lit.dev/docs/components/styles */
  static styles = css`
    font-family: sans-serif;
  `;

  /** @see https://lit.dev/docs/components/rendering */
  render() {
    if (!this.blockEntity) {
      return null;
    }

    const {
      properties: { alt, src },
    } = addSimpleAccessors(this.blockEntity);

    return html`<model-viewer alt="${alt}" src="${src}" enable-pan="true" />`;
  }
}
