import { ChevronRight } from "@mui/icons-material";
import { Box, SxProps, Theme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "react-use";

import { parseHTML } from "../../../../util/htmlUtils";
import { Link } from "../../../Link";

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
  index: number;
  closeDrawer?: () => void;
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  activeResult: number;
  setActiveResult: React.Dispatch<React.SetStateAction<number>>;
  variant?: SearchVariants;
  closeResultsMenu: () => void;
  sx?: SxProps<Theme>;
}

const algoliaTypeMap: Record<AlgoliaPageType, string> = {
  docs: "Documentation",
  spec: "Specification",
};

const SearchItem: React.VoidFunctionComponent<SearchItemProps> = ({
  searchResult,
  closeDrawer,
  index,
  getHighlight,
  activeResult,
  setActiveResult,
  variant,
  closeResultsMenu,
  sx,
}) => {
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const previousActiveResult = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      previousActiveResult.current = activeResult;
    };
  }, [activeResult]);

  useEffect(() => {
    if (
      index === activeResult &&
      intersection &&
      intersection.intersectionRatio < 1 &&
      activeResult !== previousActiveResult.current &&
      variant !== "mobile"
    ) {
      document?.querySelector(`.search-list-item-${index}`)?.scrollIntoView({
        behavior: "auto",
        block: "nearest",
      });
    }
  }, [activeResult, index, intersection, variant]);

  const { title, _highlightResult, slug, type } = searchResult;

  const isActiveResult = activeResult === index;

  return (
    <Link
      href={slug}
      ref={intersectionRef}
      onClick={() => {
        closeResultsMenu();

        if (closeDrawer) {
          closeDrawer();
        }
      }}
    >
      <Box
        onMouseEnter={() => {
          setActiveResult(index);
        }}
        className={`search-list-item-${index}`}
        sx={{
          ...sx,
          padding: "1em",
          background: isActiveResult ? "#2482ff" : undefined,
          color: isActiveResult ? "white" : undefined,
        }}
      >
        <Box
          sx={{
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {algoliaTypeMap[type]}{" "}
          <ChevronRight
            sx={{
              color: "#ccc",
              width: "0.8em",
              marginBottom: "-1px",
            }}
          />{" "}
          {title}
        </Box>
        {_highlightResult?.content?.matchLevel !== "none" && (
          <Box
            sx={{
              fontSize: "12px",
              color: isActiveResult ? "white" : "rgb(116, 129, 141)",
              ".highlight-text": {
                backgroundColor: isActiveResult
                  ? "rgba(256, 256, 256, 0.3)"
                  : "rgba(56, 132, 255, 0.3)",
              },
            }}
          >
            {parseHTML(getHighlight(_highlightResult))}
          </Box>
        )}
      </Box>
    </Link>
  );
};

export default SearchItem;
