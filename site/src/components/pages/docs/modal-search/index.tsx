import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  buttonClasses,
  CircularProgress,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
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
import { useMousetrap } from "use-mousetrap";

import { Button } from "../../../button";
import { SpecificationIcon } from "../../../icons";
import { Link } from "../../../link";
import { LinkButton } from "../../../link-button";
import ModalSearchList from "./modal-search-list";

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
interface SearchProps {
  variant: SearchVariants;
  closeModal?: () => void;
}

const MAX_SEARCH_RESULTS = 10;

const ModalSearch: React.VoidFunctionComponent<SearchProps> = ({
  variant = "desktop",
  closeModal,
}) => {
  const router = useRouter();
  const theme = useTheme();

  const [searchText, setSearchText] = useState("");
  const [currentSearchedText, setCurrentSearchedText] = useState("");
  const [searchResults, setSearchResults] = useState<Array<AlgoliaResult>>([]);
  const [activeResult, setActiveResult] = useState(MAX_SEARCH_RESULTS);
  const [searchLoading, setSearchLoading] = useState(false);

  const [searchState, setSearchState] = useState<
    "normal" | "noresults" | "failed"
  >("normal");

  const form = useRef<HTMLFormElement>(null);

  const searchOnlineDebounce = useMemo(
    () =>
      debounce((newSearchText: string) => {
        setSearchState("normal");
        setSearchLoading(true);
        index
          .search<AlgoliaResult>(newSearchText)
          .then(({ hits }) => {
            if (hits.length === 0) {
              setSearchState("noresults");
            }

            setSearchResults(hits.slice(0, MAX_SEARCH_RESULTS));
            setActiveResult(MAX_SEARCH_RESULTS);
            setCurrentSearchedText(newSearchText);
            setSearchLoading(false);
          })
          .catch((err) => {
            // @todo use logger later
            // eslint-disable-next-line no-console
            console.error(err);
            setSearchLoading(false);
            setSearchState("failed");
          });
      }, 500),
    [],
  );

  const searchOnlineFunction = () => {
    (document.querySelector(`.search-bar input`) as HTMLElement).focus();

    searchOnlineDebounce(searchText);
  };

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
  useMousetrap("/", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const desktopSearchSelector = document.querySelector(
      `.search-bar.desktop input`,
    ) as HTMLElement;

    if (desktopSearchSelector) {
      desktopSearchSelector.focus();
    }
  });

  const getHighlight = (highlight: AlgoliaHighlightResult) => {
    let content = highlight.content.value;
    const title = `# ${highlight.title.value}\n\n`;

    if (content.indexOf(title) === 0) {
      content = content.slice(title.length);
    }

    const cleanContent = content
      .replace(/<(.*?)>|\*|#|`|\\|\((.*?)\)|\[|\]/g, "")
      .replace(/<|>/g, "");

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

  const searchFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchResults.length > 0 && searchResults[activeResult]) {
      const { slug } = searchResults[activeResult]!;

      (document.querySelector(".search-bar input") as HTMLElement).blur();

      return router.push(slug);
    } else {
      searchOnlineFunction();
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
      }}
      className={`search-bar ${variant ?? ""}`}
    >
      <form ref={form} onSubmit={searchFormSubmit}>
        <Box>
          <Box
            component="input"
            sx={{
              color: theme.palette.gray[90],
              fill: theme.palette.gray[50],
              fontSize: 15,
              paddingY: 1.5,
              paddingRight: 0.5,
              paddingLeft: 6,
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
              marginRight: 3,
              width: 1,
              borderColor: theme.palette.gray[30],
              borderWidth: 1,
              borderRadius: 1.5,
              "&::placeholder": {
                color: theme.palette.gray[50],
              },
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
            placeholder="Search The BP"
            required
          />
          <SearchIcon
            sx={({ palette }) => ({
              fill: palette.gray[50],
              position: "absolute",
              top: 10,
              left: 8,
            })}
          />
        </Box>

        {searchLoading && (
          <Box
            sx={{
              top: 14,
              right: 14,
              position: "absolute",
              cursor: "pointer",
              height: 20,
            }}
          >
            <CircularProgress
              style={{ height: 20, width: 20, color: "#c3c3c3" }}
            />
          </Box>
        )}

        {!searchLoading && !!searchText.length && (
          <IconButton
            onClick={() => setSearchText("")}
            sx={{
              top: 16,
              right: 16,
              position: "absolute",
            }}
          >
            <CloseIcon
              sx={({ palette }) => ({
                position: "absolute",
                width: "100%",
                height: "100%",
                fill: palette.gray[50],
              })}
            />
          </IconButton>
        )}
      </form>

      {variant === "desktop" &&
        !searchResults.length &&
        searchState === "normal" && (
          <Box sx={{ marginTop: 1.5 }}>
            <Typography
              sx={({ palette }) => ({
                fontWeight: 600,
                fontSize: 13,
                color: palette.gray[50],
                paddingY: 0.5,
                paddingX: 2,
                letterSpacing: "0.05em",
              })}
            >
              SUGGESTED TOPICS
            </Typography>

            {[
              "Introduction to the Block Protocol",
              "Quick start guide to developing blocks",
              "A guide for embedding applications",
              "Frequently asked questions",
            ].map((label) => (
              <Button
                sx={{
                  width: 1,
                  justifyContent: "start",
                  fontSize: 15,
                  color: theme.palette.gray[90],
                  paddingY: 0.5,
                  paddingX: 2,
                  "&:hover, :focus-visible": {
                    color: theme.palette.purple[800],
                    background: theme.palette.purple[100],
                  },
                }}
                key={label}
                variant="transparent"
                onClick={() => setSearchText(label)}
              >
                {label}
              </Button>
            ))}

            <LinkButton
              sx={{
                background: theme.palette.teal[100],
                alignItems: "start",
                padding: "12px 16px",
                borderRadius: 1,
                width: 1,
                justifyContent: "start",
                marginTop: 1.5,
                [`& .${buttonClasses.startIcon}`]: {
                  color: theme.palette.teal[600],
                  paddingTop: 0.5,
                  paddingLeft: 0.5,
                  marginRight: 1.5,
                  marginLeft: 0,
                },
                "&:hover": {
                  background: theme.palette.teal[200],
                },
                "&::before": {
                  display: "none",
                },
              }}
              href="/spec"
              onClick={() => closeModal?.()}
              startIcon={<SpecificationIcon />}
              squared
            >
              <Box>
                <Typography
                  sx={{
                    color: theme.palette.teal[700],
                    fontWeight: 600,
                    fontSize: 15,
                    textAlign: "start",
                  }}
                >
                  Read the official specification
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.teal[600],
                    fontWeight: 500,
                    fontSize: 14,
                    textAlign: "start",
                  }}
                >
                  Our open-source protocol for creating interoperable,
                  data-driven blocks
                </Typography>
              </Box>
            </LinkButton>
          </Box>
        )}

      {searchResults.length > 0 && (
        <Box sx={({ palette }) => ({ backgroundColor: palette.common.white })}>
          <ModalSearchList
            searchResults={searchResults}
            variant={variant}
            getHighlight={getHighlight}
            closeModal={closeModal}
          />
        </Box>
      )}

      {searchState !== "normal" && !searchLoading && (
        <Box
          sx={({ palette }) => ({
            padding: 1.5,
            backgroundColor: palette.common.white,
          })}
        >
          <Typography variant="bpSmallCopy">
            {searchState === "noresults"
              ? `No results found for your search term - please try another term`
              : `We couldn't reach our servers - please try again`}
            , or <Link href="/contact">contact us</Link>.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ModalSearch;
