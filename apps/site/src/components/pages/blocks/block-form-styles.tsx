import { Paper, styled } from "@mui/material";

export const BlockFormContainer = styled(Paper)(({ theme }) =>
  theme.unstable_sx({ flex: 1, width: "100%", p: 6 }),
);

export const BlockListContainer = styled(BlockFormContainer, {
  shouldForwardProp: (propName) => propName !== "hasBlocks",
})<{
  hasBlocks?: boolean;
}>(
  ({ hasBlocks, theme }) =>
    hasBlocks &&
    theme.unstable_sx({
      py: 1,
      pr: 4.5,
      pl: 0,

      "> *": {
        pl: 5,

        "&:last-of-type": {
          border: "none",
        },
      },
    }),
);
