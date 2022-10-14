import { Box, BoxProps, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { TableTreeIcon } from "../../icons";
import { Link } from "../../link";
import { shy } from "./utils";

type ListViewCardProps = {
  title: string;
  description?: string | null;
  icon?: string | null;
  extraContent?: ReactNode;
  url: string;
  sx?: BoxProps["sx"];
};

export const ListViewCard: FunctionComponent<ListViewCardProps> = ({
  title,
  description,
  icon,
  extraContent,
  url,
  sx = [],
}) => {
  return (
    <Link
      data-testid="list-view-card"
      href={url}
      sx={[
        {
          display: "flex",
          py: 3,
          borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
          "&:hover": {
            "& .list-view__title": {
              color: ({ palette }) => palette.purple[600],
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        component="span"
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
          <TableTreeIcon
            sx={{
              fontSize: 24,
              color: ({ palette }) => palette.gray[90],
            }}
          />
        )}
      </Box>
      <Box
        component="span"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          className="list-view__title"
          component="span"
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
          {extraContent}
        </Typography>
      </Box>
    </Link>
  );
};
