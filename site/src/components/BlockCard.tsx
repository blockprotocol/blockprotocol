import { Typography, Box, Stack, Skeleton, Link } from "@mui/material";
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
        <Typography variant="bpSmallCopy" sx={{ color: "gray.70" }}>
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
          <Typography color="gray.60" variant="bpMicroCopy">
            V2.0.2
          </Typography>
          <Typography color="gray.60" variant="bpMicroCopy">
            Updated 6 months ago
          </Typography>
        </Stack>
        <Stack direction="row">
          {/* ICON */}
          <Typography color="gray.60" variant="bpMicroCopy">344 weekly downloads</Typography>
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
  return (
    <Box
      sx={{
        py: 6,
        px: 4.25,
        minHeight: 400,
        minWidth: 288,
        maxWidth: 328,
        backgroundColor: "white",
        border: ({ palette }) => `2px dashed ${palette.gray["30"]}`,
        borderRadius: "8px",
      }}
    >
      <Typography variant="bpHeading2" sx={{ lineHeight: 1 }}>
        More Blocks coming soon
      </Typography>
      <Spacer height={3} />
      <Box sx={{ typography: "bpSmallCopy", color: "gray.60" }}>
        We’re working on checklists, kanban boards, blockquotes, and many
        more...
      </Box>
      <Spacer height={3} />
      <Box sx={{ typography: "bpSmallCopy", color: "gray.60" }}>
        You can also{" "}
        <Link
          sx={{
            color: "purple.500",
            fontWeight: 700,
            textDecoration: "underline",
          }}
        >
          build your own blocks.
        </Link>
      </Box>
    </Box>
  );
};
