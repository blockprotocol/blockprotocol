import { experimental_sx as sx, styled } from "@mui/material";

import { BlockFormContainer } from "./block-form-container";

export const BlockListContainer = styled(BlockFormContainer)<{
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
