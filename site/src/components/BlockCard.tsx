import { VFC } from "react";
import { Typography, Box, Skeleton } from "@mui/material";
import { formatDistance } from "date-fns";

import { Link } from "./Link";
import { Spacer } from "./Spacer";
import { BlockProtocolLogoIcon } from "./icons";
import { ExpandedBlockMetadata as BlockMetadata } from "../lib/blocks";

type BlockCardProps = {
  loading?: boolean;
  data?: Omit<BlockMetadata, "source" | "schema" | "variants">;
};

const blockWidthStyles = {
  mx: "auto",
  maxWidth: 450,
  /** @todo: set min-width when parent grid has been refactored to use custom breakpoints */
  // minWidth: 288,
  width: "100%",
};

const cardHoverTransition = {
  duration: 300,
  easing: "ease",
};

const BlockCardLoading = () => {
  return (
    <Box
      sx={{
        maxWidth: 450,
        minWidth: 288,
        width: "100%",
        borderRadius: "8px",
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "gray.20",
          py: 3,
          px: 2.75,
        }}
      >
        <Skeleton variant="rectangular" height={186} />
      </Box>
      <Box
        sx={{
          p: 3,
          backgroundColor: ({ palette }) => palette.common.white,
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

export const BlockCard: VFC<BlockCardProps> = ({ loading, data }) => {
  if (loading) {
    return <BlockCardLoading />;
  }

  if (!data) {
    return null;
  }

  const {
    displayName,
    description,
    image,
    author,
    version,
    lastUpdated,
    blockPackagePath,
    icon,
  } = data;

  return (
    <Link href={blockPackagePath}>
      <Box
        sx={{
          ...blockWidthStyles,
          position: "relative",
          borderRadius: "8px",
          transition: ({ transitions }) =>
            transitions.create(["transform"], cardHoverTransition),
          backgroundColor: ({ palette }) => palette.common.white,
          cursor: "pointer",
          "&::before, &::after": {
            content: `""`,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            borderRadius: "8px",
            transition: ({ transitions }) =>
              transitions.create(["opacity"], cardHoverTransition),
          },
          "&::before": {
            boxShadow: 1,
            opacity: 1,
          },
          "&::after": {
            boxShadow: 4,
            opacity: 0,
          },
          "&:hover": {
            "& .block-card__name": {
              color: ({ palette }) => palette.purple[600],
            },
            transform: "scale(1.02)",
            "&::before": {
              opacity: 0,
            },
            "&::after": {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: ({ palette }) => palette.gray[20],
            py: 3,
            px: 2.75,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <Box
            sx={{
              paddingTop: "66.67%", // height / width => 2/3
              backgroundColor: ({ palette }) =>
                image ? "transparent" : palette.gray[80],
              borderRadius: "4px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              {image ? (
                <Box
                  component="img"
                  sx={{
                    display: "block",
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    borderRadius: "4px",
                    filter: `
                        drop-shadow(0px 2px 8px rgba(39, 50, 86, 0.04))
                        drop-shadow(0px 2.59259px 6.44213px rgba(39, 50, 86, 0.06))
                        drop-shadow(0px 0.5px 1px rgba(39, 50, 86, 0.10))
                      `,
                  }}
                  src={image}
                />
              ) : (
                <Box
                  display="flex"
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <BlockProtocolLogoIcon
                    sx={{
                      color: ({ palette }) => palette.gray[50],
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            p: 3,
          }}
        >
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Box
              sx={{ mr: 1.5, width: 24, height: 24 }}
              component="img"
              src={icon ?? undefined}
            />
            <Typography
              className="block-card__name"
              fontWeight="600"
              variant="bpLargeText"
            >
              {displayName ?? undefined}
            </Typography>
          </Box>
          <Typography
            variant="bpSmallCopy"
            sx={{ display: "block", color: "gray.70" }}
          >
            {description && description?.length <= 100
              ? description
              : `${description?.slice(0, 100)}...`}
          </Typography>
          <Spacer height={3} />
          <Box
            sx={{
              typography: "bpMicroCopy",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="bpMicroCopy"
              sx={{
                color: ({ palette }) => palette.purple[600],
                mr: 1.5,
                mb: 1.5,
              }}
            >
              @{author}
            </Typography>
            <Typography
              sx={{ mr: 1.5, mb: 1.5 }}
              color="gray.60"
              variant="bpMicroCopy"
            >
              {version}
            </Typography>
            <Typography color="gray.60" variant="bpMicroCopy">
              {lastUpdated
                ? `Updated 
              ${formatDistance(new Date(lastUpdated), new Date(), {
                addSuffix: true,
              })}`
                : ""}
            </Typography>
          </Box>
          {/* Commenting this out since we don't currently track weekly downloads */}
          {/* <Stack direction="row">
     
          <Typography color="gray.60" variant="bpMicroCopy">
            344 weekly downloads
          </Typography>
        </Stack> */}
        </Box>
      </Box>
    </Link>
  );
};

export const BlockCardComingSoon = () => {
  return (
    <Box
      sx={{
        py: 6,
        px: 4.25,
        minHeight: 400,
        ...blockWidthStyles,
        backgroundColor: "white",
        border: ({ palette }) => `2px dashed ${palette.gray["30"]}`,
        borderRadius: "8px",
      }}
    >
      <Typography variant="bpHeading2" sx={{ lineHeight: 1 }}>
        More blocks coming soon
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
          href="/docs/developing-blocks"
          sx={{
            color: ({ palette }) => palette.purple[600],
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
