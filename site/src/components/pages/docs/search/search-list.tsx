import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Box, Collapse, Divider, useTheme } from "@mui/material";
import React, { forwardRef, useMemo } from "react";
import { TransitionGroup } from "react-transition-group";

import { FontAwesomeIcon, SpecificationIcon } from "../../../icons";
import { AlgoliaHighlightResult, AlgoliaResult, SearchVariants } from "./index";
import SearchListCategory from "./search-list-category";

interface SearchListProps {
  searchResults: AlgoliaResult[];
  variant?: SearchVariants;
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
}

const SearchList = forwardRef<HTMLButtonElement[], SearchListProps>(
  (
    { searchResults, variant = "desktop", getHighlight, closeModal },
    searchListItemsRef,
  ) => {
    const theme = useTheme();

    const [docResults, specResults] = useMemo(
      () => [
        searchResults.filter((result) => result.type === "docs"),
        searchResults.filter((result) => result.type === "spec"),
      ],
      [searchResults],
    );

    const listWrapperStyles = {
      desktop: {
        maxHeight: 800,
        overflowY: "auto",
        paddingX: 1.25,
        marginX: -1.25,
      },
      mobile: {
        overflowY: "visible",
      },
    };

    const isActive = !!docResults.length || !!specResults.length;

    return (
      <Box
        sx={{
          marginTop: isActive ? 3 : 0,
          overflowX: "visible",
          ...listWrapperStyles[variant],
        }}
      >
        <TransitionGroup>
          {!!docResults.length && (
            <Collapse>
              <SearchListCategory
                title="DOCUMENTATION"
                icon={
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    sx={{
                      fontSize: 16,
                      fill: theme.palette.gray[70],
                      marginRight: 1.5,
                    }}
                  />
                }
                searchResults={docResults}
                ref={searchListItemsRef}
                getHighlight={getHighlight}
                closeModal={closeModal}
              />
            </Collapse>
          )}

          {!!docResults.length && !!specResults.length && (
            <Collapse>
              <Divider sx={{ marginY: 2.5 }} />
            </Collapse>
          )}

          {!!specResults.length && (
            <Collapse>
              <SearchListCategory
                title="SPECIFICATION"
                icon={
                  <SpecificationIcon
                    sx={{
                      fontSize: 16,
                      color: theme.palette.gray[70],
                      marginRight: 1.5,
                    }}
                  />
                }
                searchResults={specResults}
                ref={searchListItemsRef}
                getHighlight={getHighlight}
                closeModal={closeModal}
              />
            </Collapse>
          )}
        </TransitionGroup>
      </Box>
    );
  },
);

export default SearchList;
