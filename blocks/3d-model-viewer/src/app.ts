import "@google/model-viewer";

import { BlockElementBase } from "@blockprotocol/graph/custom-element";
import { css, html } from "lit";

import { RootType } from "./types.gen";

export class BlockElement extends BlockElementBase<RootType> {
  /** @see https://lit.dev/docs/components/styles */
  static styles = css`
    font-family: sans-serif;
  `;

  /** @see https://lit.dev/docs/components/rendering */
  render() {
    console.log(this.blockEntity.properties);
    return html`<model-viewer
      src="${this.blockEntity?.properties[
        "https://alpha.hash.ai/@ciaran/types/property-type/src/"
      ]}"
    />`;
  }
}
