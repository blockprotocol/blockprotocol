import { useEffect, useMemo, useState, VoidFunctionComponent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  useMediaQuery,
  Divider,
  Box,
  Container,
  Grid,
  useTheme,
} from "@mui/material";

import { useUser } from "../../../context/UserContext";
import { EntityType } from "../../../lib/api/model/entityType.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { Button } from "../../Button";

import { CreateSchemaModal } from "../../Modal/CreateSchemaModal";
import { ListViewCard } from "./ListViewCard";
import { OverviewCard } from "./OverviewCard";
import { Sidebar } from "./Sidebar";
import { TABS, TabHeader, TabPanel, TabValue } from "./Tabs";

const SIDEBAR_WIDTH = 300;

export type UserPageProps = {
  blocks: ExpandedBlockMetadata[];
  entityTypes: EntityType[];
  initialActiveTab: TabValue;
  user: SerializedUser;
};

export const UserPageComponent: VoidFunctionComponent<UserPageProps> = ({
  blocks,
  entityTypes,
  initialActiveTab,
  user,
}) => {
  const router = useRouter();

  useEffect(() => {
    const { profileTabs } = router.query;

    const matchingTab = TABS.find((tab) => tab.slug === profileTabs?.[0]);

    if (!matchingTab) {
      void router.replace(`/@${user.shortname}`);
    }
  }, [router, user.shortname]);

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user: currentUser } = useUser();

  const isCurrentUserPage = useMemo(() => {
    if (currentUser !== "loading" && currentUser) {
      return currentUser.id === user.id;
    }
    return false;
  }, [user, currentUser]);

  return (
    <>
      <Head>
        <title>{user.shortname}</title>
      </Head>
      <Divider
        sx={{
          borderColor: ({ palette }) => palette.gray[20],
        }}
      />
      <Box
        sx={{
          background: ({ palette }) => palette.gray[10],
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
          pb: 10,
          mt: { xs: 4, md: 10 },
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flex: 1,
            justifyContent: "flex-start",
            maxWidth: "1200px !important",
          }}
        >
          {/* SIDEBAR */}
          <Box
            sx={{
              width: { xs: "100%", md: SIDEBAR_WIDTH },
              mr: { xs: 0, md: 8 },
              background: {
                xs: theme.palette.common.white,
                md: "transparent",
              },
              pb: 8,
            }}
          >
            <Sidebar isMobile={isMobile} user={user} />
          </Box>
          {/* CONTENT */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            {/* TAB HEADER */}
            <TabHeader
              activeTab={activeTab}
              setActiveTab={(nextTab) => {
                setActiveTab(nextTab);
                return router.push(
                  `/@${user.shortname}/${
                    TABS.find((tab) => tab.value === nextTab)?.slug
                  }`,
                );
              }}
              tabs={TABS}
              tabItemsCount={{
                blocks: blocks.length,
                schemas: entityTypes.length,
              }}
            />
            {/* TAB PANELS  */}
            {/* @todo move this to pages/user/Tabs.tsx */}
            <TabPanel activeTab={activeTab} value="overview" index={0}>
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
            </TabPanel>
            <TabPanel activeTab={activeTab} value="blocks" index={1}>
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
            </TabPanel>
            <TabPanel activeTab={activeTab} value="schemas" index={2}>
              {isCurrentUserPage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "flex-end" },
                  }}
                >
                  <Button
                    squared
                    size="small"
                    onClick={() => setSchemaModalOpen(true)}
                  >
                    Create New Schema
                  </Button>
                </Box>
              )}
              {entityTypes.map(({ entityTypeId, schema, updatedAt }) => (
                <ListViewCard
                  key={entityTypeId}
                  type="schema"
                  title={schema.title}
                  description={schema.description as string}
                  lastUpdated={updatedAt as unknown as string}
                  url={schema.$id}
                />
              ))}
            </TabPanel>
          </Box>
        </Container>
      </Box>
      <CreateSchemaModal
        open={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />
    </>
  );
};
