import { ExpandedBlockMetadata } from "./blocks";

// Blocks which are currently not compliant with the spec, and are thus misleading examples
const blocksToHide = ["@hash/embed"];

/** Helps consistently hide certain blocks from the Hub and user profile pages */
export const excludeHiddenBlocks = (
  blocks: ExpandedBlockMetadata[],
): ExpandedBlockMetadata[] => {
  return blocks.filter(
    ({ pathWithNamespace }) => !blocksToHide.includes(pathWithNamespace),
  );
};
