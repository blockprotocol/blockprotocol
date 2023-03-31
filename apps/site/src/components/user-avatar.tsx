import { Avatar, AvatarProps, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { SerializedUser } from "../lib/api/model/user.model";

interface UserAvatarProps {
  user: SerializedUser;
  size?: number;
  sx?: AvatarProps["sx"];
}

const getInitial = (name?: string) => {
  if (name?.[0]) {
    return name[0].toUpperCase();
  }
  return "U";
};

export const UserAvatar: FunctionComponent<UserAvatarProps> = ({
  user,
  size = 32,
  sx = [],
}) => {
  const { preferredName, userAvatarUrl } = user || {};

  return (
    <Avatar
      src={userAvatarUrl}
      sx={[
        {
          width: size,
          height: size,
          backgroundColor: "gray.20",
          border: "1px solid",
          borderColor: "gray.30",
          color: "gray.70",
          fontSize: size / 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        sx={{ color: "inherit", fontSize: "inherit", fontWeight: "inherit" }}
      >
        {getInitial(preferredName)}
      </Typography>
    </Avatar>
  );
};
