import React, { FunctionComponent, useState } from "react";
import { Box, Container, Typography, Tabs, Tab, BoxProps } from "@mui/material";
import Head from "next/head";
import { NextPage, GetServerSideProps } from "next";
import { ListView } from "../../components/pages/user/ListView";
import { apiClient } from "../../lib/apiClient";
import { EntityType } from "../../lib/model/entityType.model";
import { ExpandedBlockMetadata } from "../../lib/blocks";
import { SerializedUser } from "../../lib/model/user.model";
import { Avatar } from "../../components/pages/user/Avatar";

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
const SIDEBAR_MARGIN = 64;

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
  console.log(params);
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

  console.log({ user, blocks, entityTypes });

  return (
    <>
      <Head>
        <title>{user.shortname}</title>
      </Head>
      <Box
        sx={{
          background: ({ palette }) => palette.gray[10],
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: ({ palette }) => palette.gray[20],
            backgroundColor: ({ palette }) => palette.common.white,
            borderBottomStyle: "solid",
            paddingTop: {
              xs: 2,
              md: 5,
            },
          }}
        >
          <Container>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              aria-label="user-profile-tabs"
              sx={{
                paddingLeft: `${SIDEBAR_WIDTH + SIDEBAR_MARGIN}px`,
              }}
            >
              {tabs.map(({ title, value }, i) => (
                <Tab
                  key={value}
                  label={title}
                  value={value}
                  id={`profile-tab-${i}`}
                  aria-controls={`profile-tabpanel-${i}`}
                />
              ))}
            </Tabs>
          </Container>
        </Box>

        <Container
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
          {/* sidebar */}
          <Box
            sx={{
              width: SIDEBAR_WIDTH,
              marginRight: `${SIDEBAR_MARGIN}px`,
            }}
          >
            <Box
              sx={{
                mt: -4,
                width: "100%",
              }}
            >
              <Avatar
                size={250}
                name={user.preferredName || user.shortname}
                sx={{
                  mb: 2,
                }}
              />
              <Typography variant="bpHeading3" sx={{ mb: 0.5 }}>
                {user.preferredName}
              </Typography>
              <Typography
                variant="bpLargeText"
                sx={{
                  color: ({ palette }) => palette.gray[60],
                }}
              >
                {`@${user.shortname}`}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              pt: 4,
              flex: 1,
            }}
          >
            <TabPanel activeTab={activeTab} value="overview" index={0}>
              Overview
            </TabPanel>
            <TabPanel activeTab={activeTab} value="blocks" index={1}>
              {blocks.map(
                ({ displayName, description, icon, lastUpdated, version }) => (
                  <ListView
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
                <ListView
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
