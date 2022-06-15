import { Box, Typography, typographyClasses, useTheme } from "@mui/material";
import React from "react";

import { parseHTML } from "../../../../util/html-utils";
import { LinkButton } from "../../../link-button";
import { AlgoliaHighlightResult, AlgoliaResult } from "./index";

interface SearchItemProps {
  searchResult: AlgoliaResult;
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
}

const ModalSearchListItem: React.VoidFunctionComponent<SearchItemProps> = ({
  searchResult,
  getHighlight,
  closeModal,
}) => {
  const theme = useTheme();
  const { title, _highlightResult, slug } = searchResult;

  return (
    <LinkButton
      sx={{
        width: 1,
        justifyContent: "start",
        fontSize: 15,
        color: theme.palette.gray[90],
        paddingY: 1,
        paddingX: 6,
        "&:hover, :focus-visible": {
          color: theme.palette.purple[800],
          background: theme.palette.purple[100],
          [`& .${typographyClasses.root}`]: {
            color: theme.palette.purple[800],
          },
        },
        "&::before": {
          display: "none",
        },
      }}
      variant="transparent"
      href={slug}
      onClick={() => closeModal?.()}
    >
      <Box>
        <Typography
          sx={({ palette }) => ({
            color: palette.gray[50],
            fontWeight: 500,
            fontSize: 14,
            marginBottom: 0.5,
          })}
        >
          {title}
        </Typography>

        <Typography
          sx={({ palette }) => ({
            color: palette.gray[90],
            fontSize: 16,
            fontWeight: 400,
            ".highlight-text": {
              textDecoration: "underline",
              textUnderlineOffset: 2,
            },
          })}
        >
          {parseHTML(getHighlight(_highlightResult))}
        </Typography>
      </Box>
    </LinkButton>
  );
};

export default ModalSearchListItem;
