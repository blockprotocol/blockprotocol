import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { FunctionComponent } from "react";

import { SerializedUser } from "../../../context/user-context";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { OverviewCard } from "./overview-card";
import { Placeholder } from "./placeholder";
import { BrowseHubButton } from "./placeholder-buttons";

export interface TabPanelContentsWithOverviewProps {
  blocks: ExpandedBlockMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithOverview: FunctionComponent<
  TabPanelContentsWithOverviewProps
> = ({ blocks, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    <Grid
      columnSpacing={{ xs: 0, sm: 2 }}
      rowSpacing={{ xs: 2, sm: 4 }}
      container
    >
      {blocks.map(
        (
          {
            displayName,
            description,
            icon,
            lastUpdated,
            version,
            name,
            image,
            blockSitePath,
          },
          index,
        ) => (
          <Grid key={name} item xs={12} md={6}>
            <OverviewCard
              url={blockSitePath}
              description={description!}
              icon={icon}
              image={image}
              lastUpdated={lastUpdated}
              title={displayName!}
              type="block"
              version={version}
              hideImage={index > 1 || isMobile}
            />
          </Grid>
        ),
      )}
    </Grid>
  );
};
