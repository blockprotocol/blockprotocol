import { VoidFunctionComponent } from "react";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { LinkButton } from "../../LinkButton";
import { ListViewCard } from "./ListViewCard";
import { Placeholder } from "./Placeholder";
import { useUserIsCurrent } from "./useUserIsCurrent";

export interface TabPanelContentsWithBlocksProps {
  blocks: ExpandedBlockMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithBlocks: VoidFunctionComponent<
  TabPanelContentsWithBlocksProps
> = ({ blocks, user }) => {
  const userIsCurrent = useUserIsCurrent(user);

  if (!blocks.length) {
    return userIsCurrent ? (
      <Placeholder
        header="You haven’t created any blocks yet"
        tip="Start building to see your creations show up here."
        actions={
          <LinkButton variant="secondary" href="/hub">
            Browse the Block Hub
          </LinkButton>
        }
      />
    ) : (
      <Placeholder
        header={`@${user.shortname} hasn’t created any blocks yet`}
        tip="You can browse existing blocks and schemas on the Block Hub."
        actions={
          <LinkButton variant="secondary" href="/hub">
            Browse the Block Hub
          </LinkButton>
        }
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
