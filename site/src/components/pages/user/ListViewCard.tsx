import { VFC } from "react";
import { Box, Typography, Icon } from "@mui/material";
import { formatDistance } from "date-fns";
import { Link } from "../../Link";
import { shy } from "./utils";

type ListViewCardProps = {
  type: "block" | "schema";
  title: string;
  description?: string | null;
  icon?: string | null;
  lastUpdated?: string | null;
  url: string;
};

export const ListViewCard: VFC<ListViewCardProps> = ({
  title,
  description,
  icon,
  lastUpdated,
  url,
}) => {
  return (
    <Link href={url}>
      <Box
        sx={{
          display: "flex",
          pt: 3,
          pb: 3,
          borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
          "&:hover": {
            "& .list-view__title": {
              color: ({ palette }) => palette.purple[600],
            },
          },
        }}
      >
        <Box
          sx={{
            mr: 2,
            minWidth: 24, // icon width
          }}
        >
          {icon ? (
            <Box
              component="img"
              src={icon}
              sx={{
                height: 24,
                width: 24,
              }}
            />
          ) : (
            <Icon
              sx={{
                height: 24,
                width: 24,
                color: ({ palette }) => palette.gray[90],
              }}
              className="fa-solid fa-table-tree"
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            className="list-view__title"
            sx={{
              fontWeight: 600,
              color: ({ palette }) => palette.gray[90],
              mb: 1,
              lineHeight: 1,
            }}
          >
            {shy(title)}
          </Typography>
          <Typography
            variant="bpSmallCopy"
            sx={{
              color: ({ palette }) => palette.gray[80],
              mb: 1,
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="bpMicroCopy"
            sx={{
              color: ({ palette }) => palette.gray[70],
            }}
          >
            {lastUpdated
              ? `Updated 
              ${formatDistance(new Date(lastUpdated), new Date(), {
                addSuffix: true,
              })}`
              : ""}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};
