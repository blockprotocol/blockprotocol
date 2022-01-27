import React, { FunctionComponent, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  BoxProps,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import Head from "next/head";
import { NextPage, GetServerSideProps } from "next";
import { ListViewCard } from "../../components/pages/user/ListViewCard";
import { apiClient } from "../../lib/apiClient";
import { EntityType } from "../../lib/model/entityType.model";
import { ExpandedBlockMetadata } from "../../lib/blocks";
import { SerializedUser } from "../../lib/model/user.model";
import { Sidebar } from "../../components/pages/user/Sidebar";
import { OverviewCard } from "../../components/pages/user/OverviewCard";

const tabs = [
  {
    title: "Overview",
    value: "overview",
  },
  {
    title: "Blocks",
    value: "blocks",
  },
  {
    title: "Schemas",
    value: "schemas",
  },
] as const;

type TabPanelProps = {
  index: number;
  value: string;
  activeTab: string;
} & BoxProps;

const SIDEBAR_WIDTH = 300;

export const TabPanel: FunctionComponent<TabPanelProps> = ({
  value,
  activeTab,
  index,
  children,
  ...boxProps
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== activeTab}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      sx={{ height: "100%", ...boxProps.sx }}
      {...boxProps}
    >
      {value === activeTab ? children : null}
    </Box>
  );
};

type UserPageProps = {
  user: SerializedUser;
  blocks: ExpandedBlockMetadata[];
  entityTypes: EntityType[];
};

type UserPageQueryParams = {
  shortname: string;
};

export const getServerSideProps: GetServerSideProps<
  UserPageProps,
  UserPageQueryParams
> = async ({ params }) => {
  const { shortname } = params || {};

  if (typeof shortname !== "string" || !shortname?.startsWith("@")) {
    return { notFound: true };
  }

  const [userResponse, blocksResponse, entityTypesResponse] = await Promise.all(
    [
      apiClient.getUser({
        shortname: shortname.replace("@", ""),
      }),
      apiClient.getUserBlocks({
        shortname: shortname.replace("@", ""),
      }),
      apiClient.getUserEntityTypes({
        shortname: shortname.replace("@", ""),
      }),
    ],
  );

  if (userResponse.error || !userResponse.data) {
    return { notFound: true };
  }

  return {
    props: {
      user: userResponse.data?.user,
      blocks: blocksResponse.data?.blocks || [],
      entityTypes: entityTypesResponse.data?.entityTypes || [],
    },
  };
};

const UserPage: NextPage<UserPageProps> = ({ user, blocks, entityTypes }) => {
  const [activeTab, setActiveTab] =
    useState<typeof tabs[number]["value"]>("overview");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // const overviewItems = useMemo(() => {

  // }, [blocks, entityTypes]);

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
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="user-profile-tabs"
              sx={{
                mt: { xs: -6, md: -6 },
                mb: 4,
              }}
            >
              {tabs.map(({ title, value }, i) => (
                <Tab
                  key={value}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {title}
                      {value !== "overview" && (
                        <Box
                          sx={{
                            ml: 1,
                            minWidth: 25,
                            minHeight: 25,
                            borderRadius: "30px",
                            px: 1,
                            py: 0.25,
                            backgroundColor: ({ palette }) => palette.gray[20],
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="bpMicroCopy"
                            sx={{
                              color: ({ palette }) => palette.gray[60],
                            }}
                          >
                            {value === "blocks"
                              ? blocks.length
                              : entityTypes.length}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                  value={value}
                  id={`profile-tab-${i}`}
                  aria-controls={`profile-tabpanel-${i}`}
                />
              ))}
            </Tabs>
            {/* TAB PANELS  */}
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
                        packagePath,
                      },
                      index,
                    ) => (
                      <Grid key={name} item xs={12} md={6}>
                        <OverviewCard
                          url={`/${packagePath}`}
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
                      description={schema.description}
                      lastUpdated={updatedAt}
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
                  version,
                  name,
                }) => (
                  <ListViewCard
                    key={name}
                    type="block"
                    icon={icon}
                    title={displayName}
                    description={description}
                    lastUpdated={lastUpdated}
                  />
                ),
              )}
            </TabPanel>
            <TabPanel activeTab={activeTab} value="schemas" index={2}>
              {entityTypes.map(({ entityTypeId, schema, updatedAt }) => (
                <ListViewCard
                  id={entityTypeId}
                  type="schema"
                  title={schema.title}
                  description={schema.description || ""}
                  lastUpdated={updatedAt as unknown as string}
                />
              ))}
            </TabPanel>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserPage;
