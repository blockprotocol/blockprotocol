import { FunctionComponent } from "react";

import { SerializedUser } from "../../../context/user-context";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { BlockListItem } from "./block-list-item";
import { Placeholder } from "./placeholder";
import { BrowseHubButton } from "./placeholder-buttons";

export interface TabPanelContentsWithBlocksProps {
  blocks: ExpandedBlockMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithBlocks: FunctionComponent<
  TabPanelContentsWithBlocksProps
> = ({ blocks, user }) => {
  if (!blocks.length) {
    return (
      <Placeholder
        header={`@${user.shortname} hasn’t published any blocks yet`}
        tip="You can browse existing blocks on the Hub."
        actions={<BrowseHubButton />}
      />
    );
  }

  return (
    <>
      {blocks.map((block) => (
        <BlockListItem key={block.name} block={block} />
      ))}
    </>
  );
};
