import { Box } from "@mui/material";

import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { formatUpdatedAt } from "../../../util/html-utils";
import { Link } from "../../link";
import { ListViewCard } from "./list-view-card";

interface BlockListItemProps {
  block: ExpandedBlockMetadata;
}

export const BlockListItem = ({ block }: BlockListItemProps) => {
  return (
    <ListViewCard
      key={block.name}
      url={block.blockSitePath}
      icon={block.icon}
      title={block.displayName!}
      description={block.description}
      extraContent={
        <Box display="flex" gap={1.5}>
          <Link href={`/@${block.author}`}>@{block.author}</Link>
          <span>{`V${block.version}`}</span>
          <span>{formatUpdatedAt(block.lastUpdated)}</span>
        </Box>
      }
    />
  );
};
