import React, { useState, useMemo, useCallback, FormEvent } from "react";
import {
  Box,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ListViewCard } from "../../components/pages/user/ListViewCard";
import { apiClient } from "../../lib/apiClient";
import { EntityType } from "../../lib/model/entityType.model";
import { ExpandedBlockMetadata } from "../../lib/blocks";
import { SerializedUser } from "../../lib/model/user.model";
import { Sidebar } from "../../components/pages/user/Sidebar";
import { OverviewCard } from "../../components/pages/user/OverviewCard";
import { TabHeader, TABS, TabPanel } from "../../components/pages/user/Tabs";
import { Button } from "../../components/Button";
import { useUser } from "../../context/UserContext";
import { Modal } from "../../components/Modal";
import { TextField } from "../../components/TextField";

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

const SIDEBAR_WIDTH = 300;

const UserPage: NextPage<UserPageProps> = ({ user, blocks, entityTypes }) => {
  const [activeTab, setActiveTab] =
    useState<typeof TABS[number]["value"]>("overview");
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [newSchemaTitle, setNewSchemaTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const { user: currentUser } = useUser();

  const isCurrentUserPage = useMemo(() => {
    if (currentUser !== "loading" && currentUser) {
      return currentUser.id === user.id;
    }
    return false;
  }, [user, currentUser]);

  const handleSchemaTitleChange = (value: string) => {
    let formattedText = value.trim();
    // replace all empty spaces
    formattedText = formattedText.replace(/\s/g, "");

    // capitalize text
    if (formattedText.length > 1) {
      formattedText = formattedText[0].toUpperCase() + formattedText.slice(1);
    }

    setNewSchemaTitle(formattedText);
  };

  const handleCreateSchema = useCallback(
    async (evt: FormEvent) => {
      evt.preventDefault();
      if (newSchemaTitle == "") {
        setError("Please enter a valid value");
        return;
      }

      setLoading(true);
      const { data, error: apiError } = await apiClient.createEntityType({
        schema: {
          title: newSchemaTitle,
        },
      });
      setLoading(false);
      if (apiError) {
        if (apiError.response?.data.errors) {
          setError(apiError.response.data.errors[0].msg);
        } else {
          // @todo properly handle this
          setError("An error occured");
        }
      } else {
        const schemaTitle = data?.entityType.schema.title;
        void router.push(`/@${user.shortname}/types/${schemaTitle}`);
      }
    },
    [user, newSchemaTitle, router],
  );

  console.log(entityTypes);

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
              setActiveTab={setActiveTab}
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
                  packagePath,
                }) => (
                  <ListViewCard
                    key={name}
                    type="block"
                    icon={icon}
                    title={displayName!}
                    description={description}
                    lastUpdated={lastUpdated}
                    url={`/${packagePath}`}
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
      {/* Create Schema Modal */}
      {/* @todo move to a separate component */}
      <Modal
        open={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
        contentStyle={{
          top: "40%",
        }}
      >
        <Box sx={{}}>
          <Typography
            variant="bpHeading4"
            sx={{
              mb: 2,
              display: "block",
            }}
          >
            Create New <strong>Schema</strong>
          </Typography>
          <Typography
            sx={{
              mb: 4,
              fontSize: 16,
              lineHeight: 1.5,
              width: { xs: "90%", md: "85%" },
            }}
          >
            {` Schemas are used to define the structure of entities - in other
            words, define a ‘type’ of entity`}
          </Typography>
          <Box component="form" onSubmit={handleCreateSchema}>
            <TextField
              sx={{ mb: 3 }}
              label="Schema Title"
              fullWidth
              helperText={error}
              value={newSchemaTitle}
              onChange={(evt) => {
                if (error) {
                  setError("");
                }
                handleSchemaTitleChange(evt.target.value);
              }}
              required
              error={Boolean(error)}
            />

            <Button
              loading={loading}
              // onClick={createSchema}
              size="small"
              squared
              type="submit"
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default UserPage;
