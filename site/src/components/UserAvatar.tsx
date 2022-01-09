import { VFC, useContext } from "react";
import { Box } from "@mui/material";
import UserContext from "./context/UserContext";

export const UserAvatar: VFC = () => {
  const { user } = useContext(UserContext);

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
      <Box component="span" sx={{ color: ({ palette }) => palette.gray[60] }}>
        {preferredName?.charAt(0).toUpperCase()}
      </Box>
    </Box>
  );
};
