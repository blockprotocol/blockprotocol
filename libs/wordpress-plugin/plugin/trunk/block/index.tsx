import { registerBlockType } from "@wordpress/blocks";

import blockJson from "./block.json";
import { EditOrPreview } from "./edit-or-preview";

// @ts-expect-error -- @todo investigate this
registerBlockType("blockprotocol/block", {
  ...blockJson,
  edit: EditOrPreview,
  supports: {
    customClassName: false,
    html: false,
  },
});
