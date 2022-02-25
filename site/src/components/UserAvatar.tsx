import { VFC } from "react";
import { Box } from "@mui/material";
import { SerializedUser } from "../lib/api/model/user.model";

interface UserAvatarProps {
  user: SerializedUser;
}

export const UserAvatar: VFC<UserAvatarProps> = ({ user }) => {
  const { preferredName } = user || {};

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: ({ palette }) => palette.gray[20],
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: ({ palette }) => palette.gray[30],
      }}
    >
      <Box component="span" sx={{ color: ({ palette }) => palette.gray[70] }}>
        {preferredName?.charAt(0).toUpperCase()}
      </Box>
    </Box>
  );
};
