import { Box, Stack, Typography } from "@mui/material";

import { ServiceItemDescription } from "./hub";

const ProviderAvatar = ({
  color,
  initial,
}: {
  color: string;
  initial: string;
}) => (
  <Box
    aria-hidden
    sx={{
      width: 28,
      minWidth: 28,
      height: 28,
      borderRadius: "50%",
      backgroundColor: color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: initial.length > 1 ? 11 : 13,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: initial.length > 1 ? "-0.02em" : 0,
      textTransform: "none",
      flexShrink: 0,
      // Slight inset shadow so light-coloured avatars (e.g. yellow Hugging
      // Face, lime Shopify) still read as a distinct circle on white.
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.05)",
    }}
  >
    {initial}
  </Box>
);

const CategoryChip = ({ label }: { label: string }) => (
  <Box
    component="span"
    sx={(theme) => ({
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      px: 1,
      borderRadius: 999,
      backgroundColor: theme.palette.gray[10],
      color: theme.palette.gray[80],
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "-0.005em",
      whiteSpace: "nowrap",
    })}
  >
    {label}
  </Box>
);

export const ServiceItem = ({ item }: { item: ServiceItemDescription }) => (
  <Stack direction="row" spacing={2} alignItems="start">
    <ProviderAvatar color={item.providerColor} initial={item.providerInitial} />
    <Stack spacing={0.75} flex={1} minWidth={0}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={{ xs: 0.75, sm: 1.5 }}
        useFlexGap
        flexWrap="wrap"
      >
        <Typography
          fontSize={18}
          fontWeight={600}
          lineHeight={1.2}
          sx={{ color: "gray.90" }}
        >
          {item.name}
        </Typography>
        <CategoryChip label={item.category} />
      </Stack>
      <Typography
        variant="bpSmallCopy"
        sx={{
          color: (theme) => theme.palette.gray[80],
          fontSize: 15,
          fontWeight: 400,
        }}
      >
        {item.description}
      </Typography>
      <Typography component="div" fontSize={14} sx={{ color: "gray.70" }}>
        <Box
          component="span"
          sx={{ color: "purple.70" }}
          fontWeight={700}
          // The handle style mirrors block authors (e.g. `@hash`) but services
          // are aspirational and don't yet have provider profile pages, so we
          // intentionally render this as plain text rather than a link.
        >
          @{item.providerHandle}
        </Box>
      </Typography>
    </Stack>
  </Stack>
);
