import { Box, Typography } from "@mui/material";
import { NextSeo } from "next-seo";

import { withAuthWall } from "../../../components/pages/auth-wall";
import { BlockFormLayout } from "../../../components/pages/blocks/block-form-layout";
import { BlockFormSection } from "../../../components/pages/blocks/block-form-section";
import { PublishBlockCard } from "../../../components/pages/blocks/publish-block-card";
import { PageContainer } from "../../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../../components/pages/dashboard/top-navigation-tabs";

const PublishPage = () => {
  return (
    <>
      <NextSeo title="Block Protocol – Publish Block" />

      <TopNavigationTabs />

      <PageContainer>
        <Typography variant="bpHeading2" mb={4}>
          Add a new block
        </Typography>

        <BlockFormLayout>
          <BlockFormSection title="Choose how to publish your block">
            <Box display="flex" flexDirection="column" gap={4}>
              <PublishBlockCard
                publishFrom="npm"
                logoSrc="/assets/npm-logo.svg"
                description="Choose an existing public npm package to publish on the Hub"
                href="/blocks/publish/npm"
              />
              <PublishBlockCard
                publishFrom="Git"
                logoSrc="/assets/git-logo.svg"
                description="Point to a block within a public Git repository to publish on the Hub"
              />
            </Box>
          </BlockFormSection>
        </BlockFormLayout>
      </PageContainer>
    </>
  );
};

export default withAuthWall(PublishPage);
