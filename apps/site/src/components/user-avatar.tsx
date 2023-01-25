import { Box } from "@mui/material";
import { FunctionComponent } from "react";

import { SerializedUser } from "../lib/api/model/user.model";

interface UserAvatarProps {
  user: SerializedUser;
  size?: number;
}

export const UserAvatar: FunctionComponent<UserAvatarProps> = ({
  user,
  size = 32,
}) => {
  const { preferredName } = user || {};

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        minWidth: size,
        minHeight: size,
        borderRadius: "50%",
        backgroundColor: ({ palette }) => palette.gray[20],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: ({ palette }) => palette.gray[30],
      }}
    >
      <Box
        component="span"
        sx={{ color: ({ palette }) => palette.gray[70], fontSize: size / 2 }}
      >
        {preferredName?.charAt(0).toUpperCase()}
      </Box>
    </Box>
  );
};
