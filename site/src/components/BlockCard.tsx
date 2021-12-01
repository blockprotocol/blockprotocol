import { Typography, Box, Stack, Skeleton } from "@mui/material";
import { Spacer } from "./Spacer";
import React, { FC } from "react";

type BlockCardProps = {
  loading?: boolean;
  blockName: string;
  image: string;
  icon: string;
};

export const BlockCard: FC<BlockCardProps> = ({ loading, blockName }) => {
  if (loading) {
    return <BlockCardLoading />;
  }

  return (
    <Box
      sx={{
        minWidth: 288,
        maxWidth: 328,
        borderRadius: "8px",
        boxShadow: 1,
        transition: "0.3s ease",
        "&:hover": {
          boxShadow: 4,
          "& .block-card__name": {
            color: "purple.500",
          },
        },
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          backgroundColor: "gray.20",
          pt: 3,
          pb: 3,
          pl: 2.75,
          pr: 2.75,
        }}
      >
        {/* should be the image */}

        <Box
          sx={{
            height: 186,
            backgroundColor: "gray.70",
            borderRadius: "4px",
          }}
        ></Box>
      </Box>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Box sx={{ mb: 2 }}>
          {/* Icon here */}
          <Typography
            className="block-card__name"
            fontWeight="600"
            variant="bpLargeText"
          >
            Video
          </Typography>
        </Box>
        <Typography variant="bpSmallCopy">
          {/* @todo ensure only the first 100 chars are shown */}
          Play videos of any type or length with rich media controls.
        </Typography>
        <Spacer height={3} />
        <Stack
          direction="row"
          gap={1.5}
          sx={{ mb: 1.5, typography: "bpMicroCopy" }}
        >
          <Typography variant="bpMicroCopy" color="purple.500">
            @hash
          </Typography>
          <Typography variant="bpMicroCopy">V2.0.2</Typography>
          <Typography variant="bpMicroCopy">Updated 6 months ago</Typography>
        </Stack>
        <Stack direction="row">
          {/* ICON */}
          <Typography variant="bpMicroCopy">344 weekly downloads</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

const BlockCardLoading = () => {
  return (
    <Box
      sx={{
        minWidth: 288,
        maxWidth: 328,
        borderRadius: "8px",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "gray.20",
          pt: 3,
          pb: 3,
          pl: 2.75,
          pr: 2.75,
        }}
      >
        <Skeleton variant="rectangular" height={186} />
      </Box>
      <Box
        sx={{
          p: 3,
        }}
      >
        <Skeleton variant="rectangular" width="100%" height={32} />
        <Spacer height={1} />
        <Skeleton variant="rectangular" width="72%" height={32} />
        <Spacer height={3} />
        <Skeleton variant="rectangular" width="72%" height={16} />
        <Spacer height={1} />
        <Skeleton variant="rectangular" width="52%" height={16} />
      </Box>
    </Box>
  );
};

// @todo add BlockCardComingSoon
export const BlockCardComingSoon = () => {

}