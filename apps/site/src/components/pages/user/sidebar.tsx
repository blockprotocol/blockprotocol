import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { SerializedUser } from "../../../lib/api/model/user.model";
import { UserAvatar } from "../../user-avatar";

type SidebarProps = {
  isMobile: boolean;
  user: SerializedUser;
};

export const Sidebar: FunctionComponent<SidebarProps> = ({
  isMobile,
  user,
}) => {
  const avatarSize = isMobile ? 72 : 250;

  return (
    <Box
      sx={{
        width: "100%",
        mt: { xs: 0, md: -4 },
        display: "flex",
        flexDirection: { xs: "row", md: "column" },
      }}
    >
      <UserAvatar
        size={avatarSize}
        user={user}
        sx={{
          mb: 2,
          mr: { xs: 2, md: 0 },
          background: `linear-gradient(359.31deg, #7158FF 0.28%, #7F68FF 99.11%)`,
          border: "none",
          borderRadius: "6px",
          color: "white",
          fontSize: 0.64 * avatarSize,
          fontWeight: 900,
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
