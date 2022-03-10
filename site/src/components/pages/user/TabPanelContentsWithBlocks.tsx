import { VoidFunctionComponent } from "react";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { ListViewCard } from "./ListViewCard";
import { Placeholder } from "./Placeholder";
import { BrowseHubButton, BuildBlockButton } from "./PlaceholderButtons";
import { useUserStatus } from "./useUserStatus";

export interface TabPanelContentsWithBlocksProps {
  blocks: ExpandedBlockMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithBlocks: VoidFunctionComponent<
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
        header={`@${user.shortname} hasn’t created any blocks yet`}
        tip="You can browse existing blocks on the Block Hub."
        actions={<BrowseHubButton />}
      />
    );
  }

  return (
    <>
      {blocks.map(
        ({
          displayName,
          description,
          icon,
          lastUpdated,
          name,
          blockPackagePath,
        }) => (
          <ListViewCard
            key={name}
            type="block"
            icon={icon}
            title={displayName!}
            description={description}
            lastUpdated={lastUpdated}
            url={blockPackagePath}
          />
        ),
      )}
    </>
  );
};
