import { Box, Typography } from "@mui/material";

// think of a better name

export const BlockCard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        pt: 3,
        pb: 3,
        borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
      }}
    >
      <Box
        sx={{
          mr: 2,
          minWidth: 24, // icon width
        }}
      >
        <Box
          component="img"
          src=""
          sx={{
            height: 24,
            width: 24,
          }}
        />
      </Box>
      <Box>
        <Typography>Employee Profile</Typography>
        <Typography>
          Display the name and profile picture of an employee in your company.
        </Typography>
        <Typography>Updated 16 months ago</Typography>
      </Box>
    </Box>
  );
};
