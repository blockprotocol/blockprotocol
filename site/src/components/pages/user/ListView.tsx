import { VFC } from "react";
import { Box, Typography, Icon } from "@mui/material";
import { formatDistance } from "date-fns";

// think of a better name

type ListViewProps = {
  type: "block" | "schema";
  title: string;
  description: string;
  icon?: string;
  lastUpdated: string;
};

export const ListView: VFC<ListViewProps> = ({
  type,
  title,
  description,
  icon,
  lastUpdated,
}) => {
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
          sx={{
            fontWeight: 600,
            color: ({ palette }) => palette.gray[80],
            mb: 1,
            lineHeight: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="bpSmallCopy"
          sx={{
            color: ({ palette }) => palette.gray[70],
            mb: 1,
          }}
        >
          {description}
        </Typography>
        <Typography
          variant="bpMicroCopy"
          sx={{
            color: ({ palette }) => palette.gray[60],
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
  );
};
