import { FunctionComponent } from "react";

import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { BlockListItem } from "./block-list-item";
import { Placeholder } from "./placeholder";
import { BrowseHubButton, BuildBlockButton } from "./placeholder-buttons";
import { useUserStatus } from "./use-user-status";

export interface TabPanelContentsWithBlocksProps {
  blocks: ExpandedBlockMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithBlocks: FunctionComponent<
  TabPanelContentsWithBlocksProps
> = ({ blocks, user }) => {
  const userStatus = useUserStatus(user);

  if (!blocks.length) {
    if (userStatus === "loading") {
      return null;
    }

    return userStatus === "current" ? (
      <Placeholder
        header="You haven’t created any blocks yet"
        tip="Start building to see your creations show up here."
        actions={<BuildBlockButton />}
      />
    ) : (
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
