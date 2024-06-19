import { Edit } from "./edit-or-preview/edit";
import { Preview } from "./edit-or-preview/preview";

type BlockProtocolBlockAttributes = {
  author: string;
  blockName: string;
  entityId: string;
  entityTypeId: string;
  preview: boolean;
  protocol: string;
  sourceUrl: string;
};

type EditProps = {
  attributes: BlockProtocolBlockAttributes;
  setAttributes: (attributes: Partial<BlockProtocolBlockAttributes>) => void;
};

/**
 * The admin view of the block – the block is in editable mode, with callbacks to create, update, and delete entities
 */
export const EditOrPreview = ({ attributes, setAttributes }: EditProps) => {
  // this represents the latest versions of blocks from the Block Protocol API
  // the page may contain older versions of blocks, so do not rely on all blocks being here
  const blocks = window.block_protocol_data?.blocks;

  const { preview, sourceUrl } = attributes;

  const selectedBlock = blocks?.find((block) => block.source === sourceUrl);

  if (preview) {
    // if we're previewing blocks we're coming from the block selector – should only be loading latest
    if (!selectedBlock) {
      throw new Error("No block data from server – could not preview");
    }

    return <Preview block={selectedBlock} />;
  }

  return <Edit attributes={attributes} setAttributes={setAttributes} />;
};
