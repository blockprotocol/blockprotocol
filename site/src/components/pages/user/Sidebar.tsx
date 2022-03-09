import { VFC } from "react";
import { Box, Typography } from "@mui/material";
import { Avatar } from "./Avatar";
import { SerializedUser } from "../../../lib/api/model/user.model";

type SidebarProps = {
  isMobile: boolean;
  user: SerializedUser;
};

export const Sidebar: VFC<SidebarProps> = ({ isMobile, user }) => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 0, md: -4 },
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
      }}
    >
      <Avatar
        size={isMobile ? 72 : 250}
        name={user.preferredName || user.shortname}
        sx={{
          mb: 2,
          mr: { xs: 2, md: 0 },
        }}
      />
      <Box>
        <Typography variant="bpHeading3" sx={{ mb: 0.5 }}>
          {user.preferredName}
        </Typography>
        <Typography
          variant="bpLargeText"
          sx={{
            color: ({ palette }) => palette.gray[70],
          }}
        >
          {`@${user.shortname}`}
        </Typography>
      </Box>
    </Box>
  );
};
