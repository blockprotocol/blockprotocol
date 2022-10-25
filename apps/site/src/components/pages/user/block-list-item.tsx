import { Box } from "@mui/material";

import { ExpandedBlockMetadata } from "../../../lib/blocks.js";
import { formatUpdatedAt } from "../../../util/html-utils.jsx";
import { ListViewCard } from "./list-view-card.jsx";

interface BlockListItemProps {
  block: ExpandedBlockMetadata;
}

export const BlockListItem = ({ block }: BlockListItemProps) => {
  const formattedUpdatedAt = formatUpdatedAt(block.lastUpdated);
  return (
    <ListViewCard
      key={block.name}
      url={block.blockSitePath}
      icon={block.icon}
      title={block.displayName!}
      description={block.description}
      extraContent={
        <Box display="flex" gap={1.5} component="span">
          <span>{`V${block.version}`}</span>
          {formattedUpdatedAt ? <span>{formattedUpdatedAt}</span> : null}
        </Box>
      }
    />
  );
};
