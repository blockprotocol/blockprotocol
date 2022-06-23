import { Box, Collapse, Grid, Typography, useTheme } from "@mui/material";
import React, { forwardRef, useMemo } from "react";
import { TransitionGroup } from "react-transition-group";

import { AlgoliaHighlightResult, AlgoliaResult } from "./index";
import SearchListHeading from "./search-list-heading";
import SearchListItem from "./search-list-item";

interface SearchListCategoryProps {
  title: string;
  icon: JSX.Element;
  searchResults: AlgoliaResult[];
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
}

const SearchListCategory = forwardRef<
  HTMLButtonElement[],
  SearchListCategoryProps
>(
  (
    { title, icon, searchResults, getHighlight, closeModal },
    searchListItemsRef,
  ) => {
    const theme = useTheme();

    const [sections, items] = useMemo(
      () => [
        searchResults.filter(
          (result) => result._highlightResult?.title?.matchLevel !== "none",
        ),
        searchResults.filter(
          (result) => result._highlightResult?.title?.matchLevel === "none",
        ),
      ],
      [searchResults],
    );

    return (
      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              paddingX: 2.25,
              marginBottom: 0.5,
            }}
          >
            {icon}

            <Typography
              sx={{
                color: theme.palette.gray[80],
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.05em",
              }}
            >
              {title}
            </Typography>
          </Box>

          <Grid container spacing={0.5}>
            <TransitionGroup>
              {sections.map((res) => (
                <Collapse key={res.objectID}>
                  <Grid item sx={{ width: 1 }}>
                    <SearchListHeading
                      searchResult={res}
                      ref={searchListItemsRef}
                      closeModal={closeModal}
                    />
                  </Grid>
                </Collapse>
              ))}
              {items.map((res) => (
                <Collapse key={res.objectID}>
                  <Grid item sx={{ width: 1 }}>
                    <SearchListItem
                      searchResult={res}
                      ref={searchListItemsRef}
                      getHighlight={getHighlight}
                      closeModal={closeModal}
                    />
                  </Grid>
                </Collapse>
              ))}
            </TransitionGroup>
          </Grid>
        </Box>
      </Box>
    );
  },
);

export default SearchListCategory;
