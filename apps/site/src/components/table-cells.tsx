import { Box, TableCell } from "@mui/material";
import { formatDistance, formatRelative } from "date-fns";
import { FunctionComponent } from "react";

export const DateTimeCell: FunctionComponent<{
  timestamp: Date | string;
}> = ({ timestamp }) => {
  return (
    <TableCell>
      <Box sx={{ marginBottom: 1 }}>
        {formatDistance(
          typeof timestamp === "string" ? new Date(timestamp) : timestamp,
          new Date(),
          {
            addSuffix: true,
          },
        )}
      </Box>
      <Box
        sx={{ fontSize: "0.9rem", color: ({ palette }) => palette.bpGray[60] }}
      >
        {formatRelative(
          typeof timestamp === "string" ? new Date(timestamp) : timestamp,
          new Date(),
        )}
      </Box>
    </TableCell>
  );
};
