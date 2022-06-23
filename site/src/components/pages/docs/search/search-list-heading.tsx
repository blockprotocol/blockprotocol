import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { svgIconClasses, useTheme } from "@mui/material";
import React, { forwardRef } from "react";

import { FontAwesomeIcon } from "../../../icons";
import { LinkButton } from "../../../link-button";
import { AlgoliaResult } from "./index";

interface SearchItemHeadingProps {
  searchResult: AlgoliaResult;
  closeModal?: () => void;
}

const SearchListHeading = forwardRef<
  HTMLButtonElement[],
  SearchItemHeadingProps
>(({ searchResult, closeModal }, searchListItemsRef) => {
  const theme = useTheme();
  const { title, slug } = searchResult;

  return (
    <LinkButton
      ref={(item) => {
        if (
          item &&
          typeof searchListItemsRef !== "function" &&
          searchListItemsRef?.current &&
          !searchListItemsRef?.current?.includes(item)
        ) {
          searchListItemsRef.current.push(item);
        }
      }}
      sx={{
        width: 1,
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.gray[90],
        paddingY: 1,
        paddingX: 6,
        justifyContent: "start",
        "&:hover, :focus-visible": {
          color: theme.palette.purple[800],
          background: theme.palette.purple[100],
          [`& .${svgIconClasses.root}`]: {
            fill: theme.palette.purple[500],
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
      <FontAwesomeIcon
        icon={faHashtag}
        sx={{
          fontSize: 16,
          fill: theme.palette.gray[50],
          marginRight: 1,
        }}
      />
      {title}
    </LinkButton>
  );
});

export default SearchListHeading;
