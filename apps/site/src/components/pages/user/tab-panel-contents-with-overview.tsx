import { EntityTypeWithMetadata } from "@blockprotocol/graph";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { FunctionComponent, useState } from "react";

import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { CreateSchemaModal } from "../../modal/create-schema-modal";
import { OverviewCard } from "./overview-card";
import { Placeholder } from "./placeholder";
import {
  BrowseHubButton,
  BuildBlockButton,
  CreateEntityTypeButton,
} from "./placeholder-buttons";
import { useUserStatus } from "./use-user-status";

export interface TabPanelContentsWithOverviewProps {
  blocks: ExpandedBlockMetadata[];
  entityTypes: EntityTypeWithMetadata[];
  user: SerializedUser;
}

export const TabPanelContentsWithOverview: FunctionComponent<
  TabPanelContentsWithOverviewProps
> = ({ blocks, entityTypes, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const userStatus = useUserStatus(user);
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);

  if (!blocks.length && !entityTypes.length) {
    if (userStatus === "loading") {
      return null;
    }

    return userStatus === "current" ? (
      <>
        <Placeholder
          header="You haven’t created any blocks or types yet"
          tip="Start building to see your creations show up here."
          actions={
            <>
              <BuildBlockButton />
              <CreateEntityTypeButton
                onClick={() => setSchemaModalOpen(true)}
              />
            </>
          }
        />
        <CreateSchemaModal
          open={schemaModalOpen}
          onClose={() => setSchemaModalOpen(false)}
        />
      </>
    ) : (
      <Placeholder
        header={`@${user.shortname} hasn’t published any blocks or types yet`}
        tip="You can browse existing blocks and types on the Hub."
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
              // we only show images for the first 2 blocks
              // on desktop
              hideImage={index > 1 || isMobile}
            />
          </Grid>
        ),
      )}
      {entityTypes.map(({ schema }) => (
        <Grid key={schema.$id} item xs={12} md={6}>
          <OverviewCard
            url={schema.$id}
            description={schema.description as string}
            title={schema.title}
            type="schema"
          />
        </Grid>
      ))}
    </Grid>
  );
};
