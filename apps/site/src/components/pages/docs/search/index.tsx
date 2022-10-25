import _CloseIcon from "@mui/icons-material/Close.js";
import _SearchIcon from "@mui/icons-material/Search.js";
import { Box, CircularProgress, Collapse, IconButton } from "@mui/material";
import _algoliasearch from "algoliasearch";
import debounce from "lodash/debounce.js";
import { useRouter } from "next/router.js";
import {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TransitionGroup } from "react-transition-group";

import { Link } from "../../../link.jsx";
import { TextField } from "../../../text-field.jsx";
import SearchList from "./search-list.jsx";
import SearchSuggestedLinks from "./search-suggested-links.jsx";

const CloseIcon = _CloseIcon as unknown as typeof _CloseIcon.default;
const SearchIcon = _SearchIcon as unknown as typeof _SearchIcon.default;
const algoliasearch =
  _algoliasearch as unknown as typeof _algoliasearch.default;

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

export const Search: FunctionComponent<SearchProps> = ({
  variant = "desktop",
  closeModal,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchListItemsRefs = useRef<HTMLButtonElement[]>([]);

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
            const slicedHits = hits.slice(0, MAX_SEARCH_RESULTS);
            setSearchState(hits.length === 0 ? "noresults" : "normal");
            setSearchResults(slicedHits);
            setActiveResult(slicedHits.length);
            setCurrentSearchedText(newSearchText);
            setSearchLoading(false);
            searchListItemsRefs.current = [];
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
    } else {
      searchOnlineDebounce.cancel();
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
    const items = searchListItemsRefs.current;

    if (activeResult >= items.length) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      items[activeResult]?.focus();
    }
  }, [activeResult]);

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
    <Box
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (searchResults.length > 0) {
          if (
            event.key === "ArrowUp" ||
            (event.shiftKey && event.key === "Tab")
          ) {
            event.preventDefault();
            return setActiveResult(
              activeResult === 0 ? searchResults.length : activeResult - 1,
            );
          }

          if (event.key === "ArrowDown" || event.key === "Tab") {
            event.preventDefault();
            return setActiveResult(
              activeResult > searchResults.length - 1 ? 0 : activeResult + 1,
            );
          }
        }
      }}
    >
      <TextField
        inputRef={inputRef}
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

      <TransitionGroup>
        {searchResults.length > 0 && (
          <Collapse>
            <Box
              sx={({ palette }) => ({ backgroundColor: palette.common.white })}
            >
              <SearchList
                searchResults={searchResults}
                searchListItemsRefs={searchListItemsRefs}
                variant={variant}
                getHighlight={getHighlight}
                closeModal={closeModal}
              />
            </Box>
          </Collapse>
        )}

        {variant === "desktop" &&
          helperText === undefined &&
          searchResults.length <= 0 && (
            <Collapse>
              <SearchSuggestedLinks closeModal={closeModal} />
            </Collapse>
          )}
      </TransitionGroup>
    </Box>
  );
};
