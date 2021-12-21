import { VFC } from "react";
import { Typography, Box, Skeleton } from "@mui/material";
import { formatDistance, subDays } from "date-fns";
import { Link } from "./Link";
import { Spacer } from "./Spacer";
import { BlockMetadata } from "../pages/api/blocks.api";

type BlockCardProps = {
  loading?: boolean;
  data?: Omit<BlockMetadata, "source" | "schema" | "variants">;
};

const blockWidthStyles = {
  maxWidth: 450,
  minWidth: 288,
  width: "100%",
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
    packagePath,
    icon,
  } = data;

  return (
    <Link href={`${packagePath}`}>
      <Box
        sx={{
          ...blockWidthStyles,
          borderRadius: "8px",
          boxShadow: 1,
          transition: ({ transitions }) =>
            transitions.create(["box-shadow", "transform"]),
          backgroundColor: ({ palette }) => palette.common.white,
          "&:hover": {
            boxShadow: 4,
            "& .block-card__name": {
              color: ({ palette }) => palette.purple[600],
            },
            transform: "scale(1.05)",
          },
          cursor: "pointer",
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
              height: 186,
              backgroundColor: ({ palette }) => palette.gray[70],
              borderRadius: "4px",
              display: "flex",
            }}
          >
            {image && (
              <Box
                component="img"
                sx={{ flex: 1, objectFit: "cover" }}
                src={image}
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            p: 3,
          }}
        >
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            {/* @todo Icon should be here */}
            <Box
              sx={{ mr: 1.5, width: 24, height: 24 }}
              component="img"
              src={`/blocks/${packagePath}/${icon}`}
            />
            <Typography
              className="block-card__name"
              fontWeight="600"
              variant="bpLargeText"
            >
              {displayName}
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
              ${formatDistance(subDays(new Date(), 3), new Date(), {
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
          href="/"
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
