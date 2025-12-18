import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { LinkIcon, TableTreeIcon } from "../../icons";
import { ClientOnlyLastUpdated } from "../../last-updated";
import { Link } from "../../link";
import { Spacer } from "../../spacer";
import { shy } from "./utils";

type OverviewCardProps = {
  type: "block" | "schema" | "link-entity-type";
  title: string;
  description?: string;
  icon?: string | null;
  lastUpdated?: string | null;
  image?: string | null;
  version?: string | null;
  url: string;
  hideImage?: boolean;
};

const TypeContent: FunctionComponent<{
  type: OverviewCardProps["type"];
}> = ({ type }) => {
  if (type === "link-entity-type") {
    return (
      <>
        <LinkIcon
          sx={{
            marginRight: "0.25rem",
            width: "1rem",
            height: "1rem",
          }}
        />
        Entity Type
      </>
    );
  } else if (type === "block") {
    return <>Block</>;
  } else {
    return <>Entity Type</>;
  }
};

export const OverviewCard: FunctionComponent<OverviewCardProps> = ({
  image,
  type,
  title,
  description,
  icon,
  lastUpdated,
  version,
  url,
  hideImage,
}) => {
  return (
    <Link data-testid="overview-card" href={url}>
      <Box
        sx={{
          borderRadius: "8px",
          boxShadow: 1,
          backgroundColor: ({ palette }) => palette.common.white,
          "&:hover": {
            boxShadow: 3,
            "& .overview-card__name": {
              color: ({ palette }) => palette.purple[600],
            },
          },
          cursor: "pointer",
        }}
      >
        {image && !hideImage && (
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
              </Box>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            p: 3,
          }}
        >
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {icon ? (
              <Box
                sx={{ mr: 1.5, width: 24, height: 24 }}
                component="img"
                src={icon}
              />
            ) : (
              <TableTreeIcon
                sx={{
                  fontSize: 24,
                  mr: 1.5,
                  color: ({ palette }) => palette.gray[90],
                }}
              />
            )}
            <Typography
              className="overview-card__name"
              fontWeight="600"
              variant="bpLargeText"
              sx={{
                mr: "80px", // ensures the title doesn't clash with "Block" | "Schema" badge
              }}
            >
              {shy(title)}
            </Typography>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                border: ({ palette }) => `1px solid ${palette.gray[30]}`,
                minHeight: 25,
                px: 1.25,
                borderRadius: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="bpMicroCopy"
                sx={{ lineHeight: 1, color: ({ palette }) => palette.gray[70] }}
              >
                <TypeContent type={type} />
              </Typography>
            </Box>
          </Box>
          {description && (
            <Typography
              variant="bpSmallCopy"
              sx={{
                display: "block",
                color: ({ palette }) => palette.gray[70],
              }}
            >
              {description.length <= 100
                ? description
                : `${description?.slice(0, 100)}...`}
            </Typography>
          )}
          <Spacer height={3} />
          <Box
            sx={{
              typography: "bpMicroCopy",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {version && (
              <Typography
                sx={{ mr: 1.5, mb: 1.5, color: "gray.60" }}
                variant="bpMicroCopy"
              >
                {version}
              </Typography>
            )}
            <Typography sx={{ color: "gray.60" }} variant="bpMicroCopy">
              <ClientOnlyLastUpdated value={lastUpdated} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};
