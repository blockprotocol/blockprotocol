import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { Box, Divider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon, SpecificationIcon } from "../../../icons";
import { AlgoliaHighlightResult, AlgoliaResult, SearchVariants } from "./index";
import ModalSearchListCategory from "./modal-search-list-category";

interface SearchItemProps {
  searchResults: AlgoliaResult[];
  variant?: SearchVariants;
  getHighlight: (highlight: AlgoliaHighlightResult) => string;
  closeModal?: () => void;
}

const ModalSearchList: React.VoidFunctionComponent<SearchItemProps> = ({
  searchResults,
  variant = "desktop",
  getHighlight,
  closeModal,
}) => {
  const theme = useTheme();
  const [docResults, setDocResults] = useState<AlgoliaResult[]>([]);
  const [specResults, setSpecResults] = useState<AlgoliaResult[]>([]);

  useEffect(() => {
    setDocResults(searchResults.filter((result) => result.type === "docs"));
    setSpecResults(searchResults.filter((result) => result.type === "spec"));
  }, [searchResults]);

  const listWrapperStyles = {
    desktop: {
      maxHeight: 800,
      overflowY: "auto",
      paddingRight: 1.25,
      marginRight: -1.25,
    },
    mobile: {
      overflowY: "visible",
    },
  };

  return (
    <Box
      sx={{
        marginTop: 3,
        overflowX: "visible",
        ...listWrapperStyles[variant],
      }}
    >
      <ModalSearchListCategory
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
        getHighlight={getHighlight}
        closeModal={closeModal}
      />

      <Divider sx={{ marginY: 2.5 }} />

      <ModalSearchListCategory
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
        getHighlight={getHighlight}
        closeModal={closeModal}
      />
    </Box>
  );
};

export default ModalSearchList;
