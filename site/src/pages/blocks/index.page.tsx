import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

import { FontAwesomeIcon } from "../../components/icons";
import { LinkButton } from "../../components/link-button";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { BlockFormContainer } from "../../components/pages/blocks/block-form-container";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import { ListViewCard } from "../../components/pages/user/list-view-card";

const BlocksPage: AuthWallPageContent = () => {
  return (
    <>
      <Head>
        <title>Block Protocol – Published Blocks</title>
      </Head>

      <TopNavigationTabs />

      <PageContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
          mb={4}
        >
          <Typography variant="bpHeading2">Published Blocks</Typography>
          <LinkButton
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            size="small"
            squared
            variant="tertiary"
            color="gray"
            href="/blocks/publish"
          >
            Add new block
          </LinkButton>
        </Box>

        <BlockFormContainer
          sx={{
            py: 1,
            pr: 4.5,
            pl: 0,

            "> *": {
              pl: 5,

              "&:last-of-type": {
                border: "none",
              },
            },
          }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <ListViewCard
              key={item}
              title="My Block"
              description="This is an amazing block, which is my block."
              lastUpdated="10.04.2021"
              url="/"
            />
          ))}
        </BlockFormContainer>
      </PageContainer>
    </>
  );
};

export default withAuthWall(BlocksPage);
