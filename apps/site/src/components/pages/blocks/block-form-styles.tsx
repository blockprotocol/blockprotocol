import { experimental_sx as sx, Paper, styled } from "@mui/material";

export const BlockFormContainer = styled(Paper)(
  sx({ flex: 1, width: "100%", p: 6 }),
);

export const BlockListContainer = styled(BlockFormContainer, {
  shouldForwardProp: (propName) => propName !== "hasBlocks",
})<{
  hasBlocks?: boolean;
}>(
  ({ hasBlocks }) =>
    hasBlocks &&
    sx({
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
