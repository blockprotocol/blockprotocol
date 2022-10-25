import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { svgIconClasses } from "@mui/material";
import { forwardRef } from "react";

import { FontAwesomeIcon } from "../../../icons/index.js";
import { LinkButton } from "../../../link-button.js";
import { AlgoliaResult } from "./index.js";

interface SearchItemHeadingProps {
  searchResult: AlgoliaResult;
  closeModal?: () => void;
}

const SearchListHeading = forwardRef<HTMLButtonElement, SearchItemHeadingProps>(
  ({ searchResult, closeModal }, ref) => {
    const { title, slug } = searchResult;

    return (
      <LinkButton
        ref={ref}
        sx={({ palette }) => ({
          width: 1,
          fontSize: 16,
          fontWeight: 600,
          color: palette.gray[90],
          paddingY: 1,
          paddingX: 6,
          justifyContent: "start",
          "&:hover, :focus-visible": {
            color: palette.purple[800],
            background: palette.purple[100],
            [`& .${svgIconClasses.root}`]: {
              fill: palette.purple[500],
            },
          },
          "&::before": {
            display: "none",
          },
        })}
        variant="transparent"
        href={slug}
        onClick={() => closeModal?.()}
      >
        <FontAwesomeIcon
          icon={faHashtag}
          sx={({ palette }) => ({
            fontSize: 16,
            fill: palette.gray[50],
            marginRight: 1,
          })}
        />
        {title}
      </LinkButton>
    );
  },
);

export default SearchListHeading;
