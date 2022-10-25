import { FunctionComponent } from "react";

import { SerializedUser } from "../../../lib/api/model/user.model.js";
import { ExpandedBlockMetadata } from "../../../lib/blocks.js";
import { BlockListItem } from "./block-list-item.jsx";
import { Placeholder } from "./placeholder.jsx";
import { BrowseHubButton, BuildBlockButton } from "./placeholder-buttons.jsx";
import { useUserStatus } from "./use-user-status.js";

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
