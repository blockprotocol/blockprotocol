/* eslint-disable no-param-reassign */
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Box, Collapse, Divider } from "@mui/material";
import { FunctionComponent, MutableRefObject, useMemo } from "react";
import { TransitionGroup } from "react-transition-group";

import { FontAwesomeIcon, SpecificationIcon } from "../../../icons/index.js";
import {
  AlgoliaHighlightResult,
  AlgoliaResult,
  SearchVariants,
} from "./index.js";
import SearchListCategory from "./search-list-category.js";

type SearchListProps = {
  searchResults: AlgoliaResult[];
  searchListItemsRefs: MutableRefObject<HTMLButtonElement[]>;
  variant?: SearchVariants;
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
};

const SearchList: FunctionComponent<SearchListProps> = ({
  searchResults,
  variant = "desktop",
  getHighlight,
  closeModal,
  searchListItemsRefs,
}) => {
  const [docResults, specResults] = useMemo(
    () => [
      searchResults.filter((result) => result.type === "docs"),
      searchResults.filter((result) => result.type === "spec"),
    ],
    [searchResults],
  );

  const listWrapperStyles = {
    desktop: {
      maxHeight: "calc(80vh - 100px)",
      overflowY: "auto",
      paddingX: 1.25,
      marginX: -1.25,
    },
    mobile: {
      overflowY: "visible",
    },
  };

  const isActive = docResults.length > 0 || specResults.length > 0;

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
                  sx={({ palette }) => ({
                    fontSize: 16,
                    fill: palette.gray[70],
                    marginRight: 1.5,
                  })}
                />
              }
              searchResults={docResults}
              registerSearchListItemRef={(element, index) => {
                searchListItemsRefs.current[index] = element;
              }}
              getHighlight={getHighlight}
              closeModal={closeModal}
            />
          </Collapse>
        )}

        {docResults.length > 0 && specResults.length > 0 && (
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
                  sx={({ palette }) => ({
                    fontSize: 16,
                    color: palette.gray[70],
                    marginRight: 1.5,
                  })}
                />
              }
              searchResults={specResults}
              registerSearchListItemRef={(element, index) => {
                searchListItemsRefs.current[docResults.length + index] =
                  element;
              }}
              getHighlight={getHighlight}
              closeModal={closeModal}
            />
          </Collapse>
        )}
      </TransitionGroup>
    </Box>
  );
};

export default SearchList;
