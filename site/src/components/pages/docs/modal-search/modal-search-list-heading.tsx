import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { svgIconClasses, useTheme } from "@mui/material";
import React from "react";

import { FontAwesomeIcon } from "../../../icons";
import { LinkButton } from "../../../link-button";

export type AlgoliaPageType = "docs" | "spec";

export type AlgoliaResult = {
  objectID: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  type: AlgoliaPageType;
  _highlightResult: AlgoliaHighlightResult;
};

export type AlgoliaHighlightResult = Record<
  keyof AlgoliaResult,
  { value: string; matchLevel: "none" | "full" }
>;

export type SearchVariants = "mobile" | "desktop";

interface SearchItemProps {
  searchResult: AlgoliaResult;
  closeModal?: () => void;
}

const ModalSearchListHeading: React.VoidFunctionComponent<SearchItemProps> = ({
  searchResult,
  closeModal,
}) => {
  const theme = useTheme();
  const { title, slug } = searchResult;

  return (
    <LinkButton
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
};

export default ModalSearchListHeading;
