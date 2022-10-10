import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { useEffect, useMemo, useState } from "react";

import { FontAwesomeIcon } from "../../components/icons";
import { LinkButton } from "../../components/link-button";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { BlockListContainer } from "../../components/pages/blocks/block-form-styles";
import { BlockListEmptyState } from "../../components/pages/blocks/block-list-empty-state";
import { PublishBlockSuccess } from "../../components/pages/blocks/publish-block-success";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import { BlockListItem } from "../../components/pages/user/block-list-item";
import { apiClient } from "../../lib/api-client";
import { ExpandedBlockMetadata } from "../../lib/blocks";
import { shouldAllowNpmBlockPublishing } from "../../lib/config";

const BlocksPage: AuthWallPageContent = ({ user }) => {
  const router = useRouter();
  const [blocks, setBlocks] = useState<ExpandedBlockMetadata[] | null>(null);

  useEffect(() => {
    if (user.shortname) {
      /** @todo replace this manual fetching with `SWR` or `React Query` for better DX/UX */
      void apiClient
        .getUserBlocks({
          shortname: user.shortname.replace("@", ""),
        })
        .then((res) => setBlocks(res.data?.blocks || []));
    }
  }, [user]);

  const recentlyCreatedBlock = useMemo(
    () => blocks?.find((block) => block.name === router.query.createdBlock),
    [blocks, router],
  );

  const blockListContent = useMemo(() => {
    const isLoading = blocks === null;

    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      );
    }

    if (!blocks?.length) {
      return <BlockListEmptyState />;
    }

    return blocks.map((block) => (
      <BlockListItem key={block.name} block={block} />
    ));
  }, [blocks]);

  return (
    <>
      <NextSeo title="Block Protocol – Published Blocks" />

      <TopNavigationTabs />

      <PageContainer>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={4}>
          <Typography variant="bpHeading2">Published Blocks</Typography>
          {shouldAllowNpmBlockPublishing && (
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
          )}
        </Box>

        {!!recentlyCreatedBlock && (
          <PublishBlockSuccess
            blockHref={`@${user.shortname}/blocks/${recentlyCreatedBlock?.name}`}
          />
        )}

        <BlockListContainer hasBlocks={!!blocks?.length}>
          {blockListContent}
        </BlockListContainer>
      </PageContainer>
    </>
  );
};

export default withAuthWall(BlocksPage);
