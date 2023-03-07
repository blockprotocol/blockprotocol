import { registerBlockVariation, updateCategory } from "@wordpress/blocks";

const svgIcon = (
  <svg
    fill="#7556DC"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="5 1 11.61 18"
    style={{
      width: 16,
      height: 16,
    }}
  >
    <path
      d="M11.5345 4.6H8.51857V3.05714C8.51857 2.51155 8.30674 1.98831 7.92968 1.60253C7.55262 1.21674 7.04121 1 6.50796 1H5V16.9429C5 17.4884 5.21183 18.0117 5.58889 18.3975C5.96596 18.7833 6.47737 19 7.01061 19H8.51857V15.4H11.5345C12.8988 15.3472 14.19 14.7556 15.1369 13.7494C16.0839 12.7432 16.6129 11.4007 16.6129 10.0039C16.6129 8.60702 16.0839 7.26453 15.1369 6.25832C14.19 5.25212 12.8988 4.6605 11.5345 4.60771V4.6ZM11.5345 11.8H8.51857V8.2H11.5345C12.5398 8.2 13.2309 9.01386 13.2309 10C13.2309 10.9861 12.5398 11.7961 11.5345 11.7961V11.8Z"
      fill="#7556DC"
    />
  </svg>
);

const { blocks } = window.block_protocol_data;

updateCategory("blockprotocol", { icon: svgIcon });

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
