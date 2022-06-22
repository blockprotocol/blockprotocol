import { Box, Collapse, Grid, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { TransitionGroup } from "react-transition-group";

import { AlgoliaHighlightResult, AlgoliaResult } from "./index";
import SearchHeading from "./search-list-heading";
import SearchItem from "./search-list-item";

interface SearchItemCategoryProps {
  title: string;
  icon: JSX.Element;
  searchResults: AlgoliaResult[];
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
}

const SearchListCategory: React.VoidFunctionComponent<
  SearchItemCategoryProps
> = ({ title, icon, searchResults, getHighlight, closeModal }) => {
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
                  <SearchHeading searchResult={res} closeModal={closeModal} />
                </Grid>
              </Collapse>
            ))}
            {items.map((res) => (
              <Collapse key={res.objectID}>
                <Grid item sx={{ width: 1 }}>
                  <SearchItem
                    searchResult={res}
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
};

export default SearchListCategory;
