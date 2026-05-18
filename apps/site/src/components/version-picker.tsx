import {
  faCheck,
  faChevronDown,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import SiteMapContext from "../context/site-map-context";
import {
  DOCS_VERSIONS,
  DocsVersion,
  formatVersionLabel,
  isDocsVersion,
  isVersionedSection,
  LATEST_DOCS_VERSION,
  VersionedSection,
} from "../lib/docs-versions";
import { SiteMapPage } from "../lib/sitemap";
import { Button } from "./button";
import { FontAwesomeIcon } from "./icons";

type VersionPickerLocation = {
  section: VersionedSection;
  version: DocsVersion;
  /** Path segments after the version, e.g. ["blocks", "environments"]. */
  rest: string[];
};

/**
 * Parses the active versioned route from a Next.js pathname.
 *
 * Returns `null` if the path doesn't address a versioned section, so the
 * caller can choose not to render the picker.
 */
const parseVersionedLocation = (
  pathname: string,
): VersionPickerLocation | null => {
  const segments = pathname.split("/").filter((segment) => segment !== "");
  const [section, version, ...rest] = segments;

  if (!section || !isVersionedSection(section)) {
    return null;
  }

  return {
    section,
    version: version && isDocsVersion(version) ? version : LATEST_DOCS_VERSION,
    rest,
  };
};

const flattenPages = (pages: SiteMapPage[]): SiteMapPage[] =>
  pages.flatMap((page) => [page, ...flattenPages(page.subPages ?? [])]);

export const VersionPicker: FunctionComponent = () => {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { versionedSubPages } = useContext(SiteMapContext);

  const location = useMemo(
    () => parseVersionedLocation(router.asPath.split(/[?#]/)[0] ?? ""),
    [router.asPath],
  );

  if (!location) {
    return null;
  }

  const isOutdated = location.version !== LATEST_DOCS_VERSION;
  const outdatedMessage = `Currently viewing an outdated version of the ${
    location.section === "spec" ? "specification" : "docs"
  }.`;

  const handleSelect = (version: DocsVersion) => {
    setOpen(false);
    if (version === location.version) {
      return;
    }
    const restPath = location.rest.length ? `/${location.rest.join("/")}` : "";
    const targetHref = `/${location.section}/${version}${restPath}`;

    // If the chosen version's union doesn't contain the current slug, the
    // static handler would 404. Fall back to that version's index so the
    // picker is always safe to click.
    const targetPages =
      versionedSubPages?.[location.section]?.[version] ?? [];
    const targetExists = flattenPages(targetPages).some(
      ({ href }) => href === targetHref,
    );

    void router.push(
      targetExists ? targetHref : `/${location.section}/${version}`,
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      <Button
        ref={buttonRef}
        variant="tertiary"
        size="small"
        onClick={() => setOpen((value) => !value)}
        endIcon={
          <FontAwesomeIcon
            icon={faChevronDown}
            sx={{ fontSize: 12, transition: "transform 150ms" }}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
        sx={(theme) => ({
          ml: { xs: 1, md: 2 },
          py: 0.5,
          px: 1.25,
          fontSize: 13,
          fontWeight: 500,
          color: theme.palette.gray[80],
          backgroundColor: theme.palette.gray[10],
          borderColor: theme.palette.gray[30],
          ":hover": {
            backgroundColor: theme.palette.gray[20],
            borderColor: theme.palette.gray[40],
            color: theme.palette.gray[90],
          },
        })}
      >
        {formatVersionLabel(location.version)}
      </Button>
      {isOutdated ? (
        // Tooltip mirrors the inline text so the warning is still discoverable
        // at small viewports (where the label collapses to icon-only). Touch
        // taps fire the tooltip via the zero `enterTouchDelay`.
        <Tooltip
          title={outdatedMessage}
          arrow
          enterTouchDelay={0}
          leaveTouchDelay={3000}
        >
          <Box
            role="status"
            sx={(theme) => ({
              ml: 1,
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              color: theme.palette.purple[600],
              cursor: "help",
              minWidth: 0,
            })}
          >
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              sx={{ fontSize: 14 }}
            />
            <Typography
              component="span"
              sx={(theme) => ({
                display: { xs: "none", md: "inline" },
                color: theme.palette.purple[600],
                fontSize: 12,
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: "nowrap",
              })}
            >
              {outdatedMessage}
            </Typography>
          </Box>
        </Tooltip>
      ) : null}
      <Menu
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        MenuListProps={{
          dense: true,
          sx: { minWidth: 200 },
        }}
      >
        {DOCS_VERSIONS.map((version) => {
          const isSelected = version === location.version;
          return (
            <MenuItem
              key={version}
              selected={isSelected}
              onClick={() => handleSelect(version)}
            >
              <ListItemIcon sx={{ minWidth: "28px !important" }}>
                {isSelected ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    sx={{ fontSize: 12 }}
                  />
                ) : null}
              </ListItemIcon>
              <ListItemText>
                <Typography variant="bpSmallCopy" sx={{ fontWeight: 500 }}>
                  {formatVersionLabel(version)}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
