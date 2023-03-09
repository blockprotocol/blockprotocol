import { Box } from "@mui/material";
import { Container } from "@mui/system";
import { FunctionComponent, ReactNode } from "react";

import {
  BlockProtocolIcon,
  BlockProtocolLogoIcon,
} from "../../../../components/icons";

export const UpgradePageLayout: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#FAFBFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container
        sx={{
          paddingTop: { xs: 6, md: 12 },
          paddingBottom: { xs: 6, md: 14 },
          flexGrow: 1,
        }}
      >
        <BlockProtocolLogoIcon
          sx={{ height: 30, marginBottom: 4, marginLeft: 2 }}
        />
        {children}
      </Container>
      <Box
        sx={{
          py: 5,
          background: ({ palette }) => palette.common.white,
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor: ({ palette }) => palette.gray[20],
        }}
      >
        <Container>
          <BlockProtocolIcon
            sx={{ color: ({ palette }) => palette.gray[40], height: 24 }}
          />
        </Container>
      </Box>
    </Box>
  );
};
