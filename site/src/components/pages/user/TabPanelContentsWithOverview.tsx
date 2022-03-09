import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useState, VoidFunctionComponent } from "react";
import { EntityType } from "../../../lib/api/model/entityType.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { Button } from "../../Button";
import { LinkButton } from "../../LinkButton";
import { CreateSchemaModal } from "../../Modal/CreateSchemaModal";
import { OverviewCard } from "./OverviewCard";
import { Placeholder } from "./Placeholder";
import { useUserIsCurrent } from "./useUserIsCurrent";

export interface TabPanelContentsWithOverviewProps {
  blocks: ExpandedBlockMetadata[];
  entityTypes: EntityType[];
  user: SerializedUser;
}

export const TabPanelContentsWithOverview: VoidFunctionComponent<
  TabPanelContentsWithOverviewProps
> = ({ blocks, entityTypes, user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const userIsCurrent = useUserIsCurrent(user);
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);

  if (!blocks.length && !entityTypes.length) {
    return userIsCurrent ? (
      <>
        <Placeholder
          header="You haven’t created any blocks or schemas yet"
          tip="Start building to see your creations show up here."
          actions={
            <>
              <LinkButton variant="secondary" href="/hub" sx={{ margin: 1 }}>
                Browse the Block Hub
              </LinkButton>
              <Button
                sx={{ margin: 1 }}
                variant="secondary"
                onClick={() => setSchemaModalOpen(true)}
              >
                Create New Schema
              </Button>
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
        header={`@${user.shortname} hasn’t created any blocks or schemas yet`}
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
    <Grid
      columnSpacing={{ xs: 0, sm: 2 }}
      rowSpacing={{ xs: 2, sm: 4 }}
      container
    >
      {blocks
        .slice(0, 4)
        .map(
          (
            {
              displayName,
              description,
              icon,
              lastUpdated,
              version,
              name,
              image,
              blockPackagePath,
            },
            index,
          ) => (
            <Grid key={name} item xs={12} md={6}>
              <OverviewCard
                url={blockPackagePath}
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
      {entityTypes.map(({ entityTypeId, schema, updatedAt }) => (
        <Grid key={entityTypeId} item xs={12} md={6}>
          <OverviewCard
            url={schema.$id}
            description={schema.description as string}
            lastUpdated={
              typeof updatedAt === "string"
                ? updatedAt
                : updatedAt?.toISOString()
            } // temporary hack to stop type error
            title={schema.title}
            type="schema"
          />
        </Grid>
      ))}
    </Grid>
  );
};
