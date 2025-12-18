import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../lib/blocks";
import { BlockProtocolLogoIcon } from "./icons";
import { ClientOnlyLastUpdated } from "./last-updated";
import { Link } from "./link";
import { Spacer } from "./spacer";
import { VerifiedBadge } from "./verified-badge";

type BlockCardProps = {
  data?: Omit<BlockMetadata, "source" | "schema" | "variants">;
};

const blockWidthStyles = {
  mx: "auto",
  maxWidth: 450,
  /** @todo: set min-width when parent grid has been refactored to use custom breakpoints */
  // minWidth: 288,
  width: "100%",
};

export const BlockCard: FunctionComponent<BlockCardProps> = ({ data }) => {
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
    blockSitePath,
    icon,
    verified,
  } = data;

  return (
    <Link data-testid="block-card" href={blockSitePath}>
      <Box
        sx={{
          ...blockWidthStyles,
          position: "relative",
          borderRadius: "8px",
          transition: ({ transitions }) => transitions.create("transform"),
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
            transition: ({ transitions }) => transitions.create("opacity"),
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
              {verified ? <VerifiedBadge compact /> : null}
            </Typography>
          </Box>
          <Typography
            variant="bpSmallCopy"
            sx={{ display: "block", color: ({ palette }) => palette.gray[70] }}
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
              sx={{ mr: 1.5, mb: 1.5, color: "gray.60" }}
              variant="bpMicroCopy"
            >
              {version}
            </Typography>
            <Typography sx={{ color: "gray.60" }} variant="bpMicroCopy">
              <ClientOnlyLastUpdated value={lastUpdated} />
            </Typography>
          </Box>
          {/* Commenting this out since we don't currently track weekly downloads */}
          {/* <Stack direction="row">
     
          <Typography color={({ palette }) => palette.gray[60]} variant="bpMicroCopy">
            344 weekly downloads
          </Typography>
        </Stack> */}
        </Box>
      </Box>
    </Link>
  );
};
