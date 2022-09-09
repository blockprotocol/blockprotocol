import {
  Box,
  Container,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextSeo } from "next-seo";
import { FunctionComponent } from "react";

import { EntityType } from "../../../lib/api/model/entity-type.model";
import { SerializedUser } from "../../../lib/api/model/user.model";
import { ExpandedBlockMetadata } from "../../../lib/blocks";
import { Sidebar } from "./sidebar";
import { TabPanelContentsWithBlocks } from "./tab-panel-contents-with-blocks";
import { TabPanelContentsWithOverview } from "./tab-panel-contents-with-overview";
import { TabPanelContentsWithSchemas } from "./tab-panel-contents-with-schemas";
import { TabHeader, TabPanel, TabValue } from "./tabs";

const SIDEBAR_WIDTH = 300;

export type UserPageProps = {
  blocks: ExpandedBlockMetadata[];
  entityTypes: EntityType[];
  activeTab: TabValue;
  user: SerializedUser;
};

export const UserPageComponent: FunctionComponent<UserPageProps> = ({
  blocks,
  entityTypes,
  activeTab,
  user,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <NextSeo title={user.shortname} />
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
              userShortname={user.shortname!}
              activeTab={activeTab}
              tabItemsCount={{
                blocks: blocks.length,
                schemas: entityTypes.length,
              }}
            />
            {/* TAB PANELS  */}
            <TabPanel activeTab={activeTab} value="overview" index={0}>
              <TabPanelContentsWithOverview
                user={user}
                blocks={blocks}
                entityTypes={entityTypes}
              />
            </TabPanel>
            <TabPanel activeTab={activeTab} value="blocks" index={1}>
              <TabPanelContentsWithBlocks user={user} blocks={blocks} />
            </TabPanel>
            <TabPanel activeTab={activeTab} value="schemas" index={2}>
              <TabPanelContentsWithSchemas
                user={user}
                entityTypes={entityTypes}
              />
            </TabPanel>
          </Box>
        </Container>
      </Box>
    </>
  );
};
