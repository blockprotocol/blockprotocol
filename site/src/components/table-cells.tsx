import { Box, TableCell } from "@mui/material";
import { formatDistance, formatRelative } from "date-fns";
import { VoidFunctionComponent } from "react";

export const DateTimeCell: VoidFunctionComponent<{
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
      <Box sx={{ fontSize: "0.9rem", color: "#64778C" }}>
        {formatRelative(
          typeof timestamp === "string" ? new Date(timestamp) : timestamp,
          new Date(),
        )}
      </Box>
    </TableCell>
  );
};
