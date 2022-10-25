import { Box, Skeleton } from "@mui/material";

import { Spacer } from "../../../spacer.jsx";
import { CardVariant } from "./dashboard-card.jsx";

interface DashboardCardLoadingProps {
  variant: CardVariant;
}

export const DashboardCardLoading = ({
  variant,
}: DashboardCardLoadingProps) => {
  if (variant === "secondary") {
    return (
      <Box
        sx={{
          borderRadius: 1,
          border: ({ palette }) => `1px solid ${palette.gray[30]}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          p: 3,
        }}
      >
        <Skeleton variant="rectangular" width={32} height={32} sx={{ mr: 3 }} />

        <Box flex={1}>
          <Skeleton variant="rectangular" width="70%" height={24} />
          <Spacer height={2} />
          <Skeleton variant="rectangular" width="100%" height={16} />
          <Spacer height={1.5} />
          <Skeleton variant="rectangular" width="72%" height={16} />
          <Spacer height={3} />
          <Skeleton variant="rectangular" width="52%" height={16} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        overflow: "hidden",
        backgroundColor: ({ palette }) => palette.common.white,
        pt: 1,
      }}
    >
      <Box p={4}>
        <Skeleton variant="rectangular" width="70%" height={32} />
        <Spacer height={3} />
        <Skeleton variant="rectangular" width="100%" height={16} />
        <Spacer height={1} />
        <Skeleton variant="rectangular" width="72%" height={16} />
        <Spacer height={3} />
        <Skeleton variant="rectangular" width="52%" height={16} />
      </Box>
    </Box>
  );
};
