import { Skeleton, Stack } from "@mui/material";

const LoadingItem = () => (
  <Skeleton variant="rounded" width="100%" height={50} />
);

export const ApiKeysLoading = () => {
  return (
    <Stack gap={2}>
      <LoadingItem />
      <LoadingItem />
      <LoadingItem />
    </Stack>
  );
};
