import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "../../components/icons";
import { Link } from "../../components/link";
import { LinkButton } from "../../components/link-button";
import {
  AuthWallPageContent,
  withAuthWall,
} from "../../components/pages/auth-wall";
import { BlockListContainer } from "../../components/pages/blocks/block-list-container";
import { BlockListEmptyState } from "../../components/pages/blocks/block-list-empty-state";
import { PageContainer } from "../../components/pages/dashboard/page-container";
import { TopNavigationTabs } from "../../components/pages/dashboard/top-navigation-tabs";
import { ListViewCard } from "../../components/pages/user/list-view-card";
import { apiClient } from "../../lib/api-client";
import { ExpandedBlockMetadata } from "../../lib/blocks";
import { formatUpdatedAt } from "../../util/html-utils";

const BlocksPage: AuthWallPageContent = ({ user }) => {
  const [blocks, setBlocks] = useState<ExpandedBlockMetadata[]>([]);

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

  const hasBlocks = !!blocks.length;

  return (
    <>
      <Head>
        <title>Block Protocol – Published Blocks</title>
      </Head>

      <TopNavigationTabs />

      <PageContainer>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={4}>
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

        <BlockListContainer hasBlocks={hasBlocks}>
          {hasBlocks ? (
            blocks.map((block) => (
              <ListViewCard
                key={block.componentId}
                url={block.blockSitePath}
                icon={block.icon}
                title={block.displayName!}
                description={block.description}
                extraContent={
                  <Box display="flex" gap={1.5}>
                    <Link href={`/@${block.author}`}>@{block.author}</Link>
                    <span>{`V${block.version}`}</span>
                    <span>{formatUpdatedAt(block.lastUpdated)}</span>
                  </Box>
                }
              />
            ))
          ) : (
            <BlockListEmptyState />
          )}
        </BlockListContainer>
      </PageContainer>
    </>
  );
};

export default withAuthWall(BlocksPage);
