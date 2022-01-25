import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import algoliasearch from "algoliasearch";
import { useMousetrap } from "use-mousetrap";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import SearchItem, {
  AlgoliaHighlightResult,
  AlgoliaResult,
  SearchVariants,
} from "./SearchItem";
import { Link } from "../../../Link";

const client = algoliasearch("POOWZ64DSV", "96dc0442fd27b903440955dc03e5e60e");
const index = client.initIndex("blockprotocol_testing");

interface SearchProps {
  variant: SearchVariants;
  closeDrawer?: () => void;
}

const MAX_SEARCH_RESULTS = 10;

export default function Search({ variant, closeDrawer }: SearchProps) {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [currentSearchedText, setCurrentSearchedText] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<AlgoliaResult>>([]);
  const [activeResult, setActiveResult] = useState(MAX_SEARCH_RESULTS);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchState, setSearchState] = useState<
    "normal" | "noresults" | "failed"
  >("normal");

  const closeResultsMenu = () => setSearchFocus(false);

  const outerNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (outerNode.current) {
        if (!outerNode.current.contains(e.target as Node)) {
          closeResultsMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClick, false);
    return () => document.removeEventListener("mousedown", handleClick, false);
  }, []);

  const searchOnlineFunction = () => {
    (document.querySelector(`.search-bar input`) as HTMLElement).focus();

    searchOnlineDebounce(searchText);
  };

  const searchOnlineDebounce = useMemo(
    () =>
      debounce((searchText: string) => {
        setSearchState("normal");
        setSearchLoading(true);
        index
          .search<AlgoliaResult>(searchText)
          .then(({ hits }) => {
            if (hits.length === 0) {
              setSearchState("noresults");
            }

            setSearchResults(hits.slice(0, MAX_SEARCH_RESULTS));
            setActiveResult(MAX_SEARCH_RESULTS);
            setCurrentSearchedText(searchText);
            setSearchLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setSearchLoading(false);
            setSearchState("failed");
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

  // mousetrap is only registered for a key once, so the function needs to account for all cases
  useMousetrap("/", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    (document.querySelector(`.search-bar input`) as HTMLElement).focus();

    const element = document.querySelector(".docs-list-sidebar");

    element?.scrollIntoView({ behavior: "smooth" });
  });

  const getHighlight = (highlight: AlgoliaHighlightResult) => {
    const cleanContent = highlight?.content?.value
      .replace(/\<(.*?)\>|\*|\#|\`|\\|\((.*?)\)|\[|\]/g, "")
      .replace(/\<|\>/g, "");

    const characterLimit = 120;

    const slicedArray = cleanContent?.slice(0, characterLimit).split(" ");

    const searchRegExp = new RegExp(
      currentSearchedText.split(" ").join("|"),
      "ig",
    );

    return slicedArray
      .slice(0, slicedArray.length - 1)
      .join(" ")
      .replace(searchRegExp, `<span class="highlight-text">$&</span>`);
  };

  const searchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchResults.length > 0 && searchResults[activeResult]) {
      const { slug } = searchResults[activeResult];

      router.push(slug);

      (document.querySelector(".search-bar input") as HTMLElement).blur();
    } else {
      searchOnlineFunction();
    }
  };

  return (
    <Box
      ref={outerNode}
      sx={{
        paddingBottom: "25px",
        position: "relative",
        paddingRight: "3em",
      }}
      className={`search-bar ${variant ?? ""}`}
    >
      <form onSubmit={searchFormSubmit}>
        <Box
          component="input"
          sx={{
            background: "white",
            border: "1px solid #d6d6d6",
            borderRadius: 2,
            px: 1.5,
            py: 1,
            paddingRight: "36px",
            width: "100%",
          }}
          onFocus={() => {
            setSearchFocus(true);
          }}
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
          placeholder="Search..."
          required
        />

        {searchLoading ? (
          <Box
            sx={{
              top: "0.65em",
              right: "calc(3em + 14px)",
              position: "absolute",
              cursor: "pointer",
              height: "20px",
            }}
          >
            <CircularProgress
              style={{ height: "20px", width: "20px", color: "#c3c3c3" }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              top: "0.35em",
              right: "calc(3em + 10px)",
              position: "absolute",
              cursor: "pointer",
              height: "20px",
            }}
          >
            <button type="submit">
              <SearchIcon sx={{ height: "20px" }} />
            </button>
          </Box>
        )}
      </form>

      {searchResults.length > 0 && searchFocus && (
        <Box
          sx={{
            width: "300px",
            maxHeight: "550px",
            position: "absolute",
            overflow: "auto",
            border: "1px solid #d6d6d6",
            borderRadius: 1,
            zIndex: "1",
          }}
        >
          <Box sx={{ backgroundColor: "white" }}>
            {searchResults.map((searchResult, searchResultIndex) => (
              <SearchItem
                variant={variant}
                searchResult={searchResult}
                key={searchResult.objectID}
                closeDrawer={closeDrawer}
                index={searchResultIndex}
                activeResult={activeResult}
                setActiveResult={setActiveResult}
                getHighlight={getHighlight}
                closeResultsMenu={closeResultsMenu}
                sx={{
                  borderBottom:
                    searchResultIndex < searchResults.length - 1
                      ? "1px solid #f1f3f6"
                      : undefined,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {searchState !== "normal" && searchFocus && !searchLoading && (
        <Box
          sx={{
            width: "300px",
            maxHeight: "550px",
            position: "absolute",
            overflow: "auto",
            border: "1px solid #d6d6d6",
            borderRadius: 1,
            zIndex: "1",
          }}
        >
          <Box
            sx={{
              padding: "1em",
              backgroundColor: "white",
            }}
          >
            <Typography variant="bpSmallCopy">
              {searchState === "noresults"
                ? `No results found for your search term - please try another term`
                : `We couldn't reach our servers - please try again`}
              , or{" "}
              <Link href="/contact">
                <a className="text-link">contact us</a>
              </Link>
              .
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
