import { registerBlockVariation } from "@wordpress/blocks";

const { blocks } = window.block_protocol_data;

const defaultBlock =
  blocks.find((block) => block.name === "paragraph") || blocks[0];

// Register each block in the BP Hub as a variant of the Gutenberg Block Protocol block
// This makes it appear as a block as its own right in the WordPress block selector
for (const block of blocks.sort((a, b) => a.name.localeCompare(b.name))) {
  const attributes = {
    author: block.author,
    blockName: block.blockType.tagName ? block.blockType.tagName : block.name,
    entityTypeId: block.schema,
    protocol: block.protocol,
    sourceUrl: block.source,
    verified: !!block.verified,
  };

  registerBlockVariation("blockprotocol/block", {
    category: "blockprotocol", // we added this as selector category in block-protocol.php
    name: block.name,
    title: block.displayName || block.name,
    description: block.description ?? "",
    icon: () => (
      <img alt={`${block.displayName} block`} src={block.icon ?? ""} />
    ),
    attributes,
    // sending preview: true as a prop when in example mode, so the block knows to return a simple image
    example: { attributes: { ...attributes, preview: true } },
    // @ts-expect-error -- types are wrong, see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
    isActive: ["sourceUrl"],
    // make a default – this hides the underlying Block Protocol block from the selector
    isDefault: block.name === defaultBlock!.name,
  });
}
