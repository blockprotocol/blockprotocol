import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Box, CircularProgress, Collapse, IconButton } from "@mui/material";
import algoliasearch from "algoliasearch";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link } from "../../../link";
import { TextField } from "../../../text-field";
import SearchList from "./search-list";
import SearchSuggestedLinks from "./search-suggested-links";

const client = algoliasearch("POOWZ64DSV", "96dc0442fd27b903440955dc03e5e60e");
const index = client.initIndex("blockprotocol");

export type AlgoliaPageType = "docs" | "spec";

export type SearchVariants = "mobile" | "desktop";

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

type SearchProps = {
  variant: SearchVariants;
  closeModal?: () => void;
};

const MAX_SEARCH_RESULTS = 10;

export const Search: React.VoidFunctionComponent<SearchProps> = ({
  variant = "desktop",
  closeModal,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useState("");
  const [currentSearchedText, setCurrentSearchedText] = useState("");
  const [searchResults, setSearchResults] = useState<Array<AlgoliaResult>>([]);
  const [activeResult, setActiveResult] = useState(MAX_SEARCH_RESULTS);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchState, setSearchState] = useState<
    "normal" | "noresults" | "failed"
  >("normal");

  const searchOnlineDebounce = useMemo(
    () =>
      debounce((newSearchText: string) => {
        setSearchLoading(true);
        index
          .search<AlgoliaResult>(newSearchText)
          .then(({ hits }) => {
            setSearchState(hits.length === 0 ? "noresults" : "normal");
            setSearchResults(hits.slice(0, MAX_SEARCH_RESULTS));
            setActiveResult(MAX_SEARCH_RESULTS);
            setCurrentSearchedText(newSearchText);
            setSearchLoading(false);
          })
          .catch((err) => {
            // @todo use logger later
            // eslint-disable-next-line no-console
            console.error(err);
            setSearchState("failed");
            setSearchLoading(false);
          });
      }, 500),
    [],
  );

  useEffect(() => {
    if (searchText.trim() && searchText.length > 2) {
      searchOnlineDebounce(searchText);
    }

    if (!searchText.trim()) {
      setSearchState("normal");
      setSearchResults([]);
    }
  }, [searchText, searchOnlineDebounce]);

  useEffect(() => {
    setSearchText("");
  }, [router.asPath]);

  const getHighlight = (highlight: AlgoliaHighlightResult) => {
    const content = highlight.content.value;

    const cleanContent = content
      .replace(/^#.*$/gm, "")
      .replace(/<(.*?)>|\*|#|`|\\|\((.*?)\)|\[|\]/g, "")
      .replace(/<|>/g, "");

    const characterLimit = 120;

    const slicedArray = cleanContent?.slice(0, characterLimit).split(" ");

    const searchRegExp = new RegExp(
      currentSearchedText
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .join("|"),
      "ig",
    );

    return slicedArray
      .slice(0, slicedArray.length - 1)
      .join(" ")
      .replace(searchRegExp, `<span class="highlight-text">$&</span>`);
  };

  useEffect(() => {
    if (variant === "desktop") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  });

  const helperText =
    searchState !== "normal" ? (
      <>
        {searchState === "noresults"
          ? `No results found for your search term - please try another term`
          : `We couldn't reach our servers - please try again`}
        , or <Link href="/contact">contact us</Link>.
      </>
    ) : undefined;

  return (
    <>
      <TextField
        inputRef={inputRef}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (searchResults.length > 0) {
            if (event.key === "ArrowUp") {
              event.preventDefault();

              if (activeResult === 0) {
                return setActiveResult(searchResults.length - 1);
              }

              setActiveResult(activeResult - 1);
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();

              if (activeResult > searchResults.length - 1) {
                return setActiveResult(0);
              }

              setActiveResult(activeResult + 1);
            }
          }
        }}
        value={searchText}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setSearchText(event.target.value)
        }
        placeholder="Search…"
        required
        InputProps={{
          sx: {
            width: "100%",
          },
          startAdornment: (
            <SearchIcon
              sx={({ palette }) => ({
                fill: palette.gray[50],
              })}
            />
          ),
          endAdornment: searchLoading ? (
            <Box p={1} display="inherit">
              <CircularProgress size={20} sx={{ color: "#c3c3c3" }} />
            </Box>
          ) : searchText.length > 0 ? (
            <IconButton onClick={() => setSearchText("")}>
              <CloseIcon
                sx={({ palette }) => ({
                  height: 20,
                  width: 20,
                  fill: palette.gray[50],
                })}
              />
            </IconButton>
          ) : undefined,
        }}
        helperText={helperText}
      />

      <Collapse in={helperText === undefined}>
        {searchResults.length > 0 ? (
          <Box
            sx={({ palette }) => ({ backgroundColor: palette.common.white })}
          >
            <SearchList
              searchResults={searchResults}
              variant={variant}
              getHighlight={getHighlight}
              closeModal={closeModal}
            />
          </Box>
        ) : variant === "desktop" ? (
          <SearchSuggestedLinks closeModal={closeModal} />
        ) : null}
      </Collapse>
    </>
  );
};
