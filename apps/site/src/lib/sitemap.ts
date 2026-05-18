import {
  getPage,
  getRoadmapSubPages,
  unionVersionedPages,
} from "../util/mdx-utils";
import {
  DOCS_VERSIONS,
  DocsVersion,
  fallbackVersionChain,
  LATEST_DOCS_VERSION,
  VersionedSection,
} from "./docs-versions";

export type SiteMapPageSection = {
  title: string;
  anchor: string;
  subSections: SiteMapPageSection[];
};

export type SiteMapPage = {
  title: string;
  href: string;
  markdownFilePath?: string;
  /** The version this page belongs to, when it lives under a versioned section. */
  version?: DocsVersion;
  subPages?: SiteMapPage[];
  sections?: SiteMapPageSection[];
};

export type VersionedSubPages = Record<DocsVersion, SiteMapPage[]>;

export type SiteMap = {
  pages: SiteMapPage[];
  /**
   * Per-version page trees for the docs and spec sections.
   *
   * Each entry is the union of pages reachable at that version (i.e. pages
   * that exist for that version, plus pages inherited from older versions
   * when not overridden), with hrefs rewritten so every link uses that
   * version's prefix.
   */
  versionedSubPages: {
    docs: VersionedSubPages;
    spec: VersionedSubPages;
  };
};

export const getDocsPagesForVersion = (
  version: DocsVersion,
): SiteMapPage[] =>
  unionVersionedPages({ section: "docs", forVersion: version });

/**
 * Loads the spec landing page for a version, walking the fallback chain to
 * find a `00_index.mdx`. The returned page's href is rewritten to use the
 * requested version, regardless of which version supplied the markdown.
 */
const getSpecLandingPageForVersion = (
  requestedVersion: DocsVersion,
): SiteMapPage => {
  for (const version of fallbackVersionChain(requestedVersion)) {
    try {
      const page = getPage({
        pathToDirectory: `spec/${version}`,
        fileName: "00_index.mdx",
      });
      return {
        ...page,
        href: `/spec/${requestedVersion}`,
        version: requestedVersion,
      };
    } catch {
      // Try the next-older version.
    }
  }

  throw new Error(
    `No spec landing page found in any version starting at ${requestedVersion}.`,
  );
};

export const getSpecPageForVersion = (
  version: DocsVersion,
): SiteMapPage => ({
  ...getSpecLandingPageForVersion(version),
  subPages: unionVersionedPages({
    section: "spec",
    forVersion: version,
    filterIndexPage: true,
  }),
});

const buildVersionedSubPages = (
  section: VersionedSection,
): VersionedSubPages =>
  Object.fromEntries(
    DOCS_VERSIONS.map((version) => [
      version,
      section === "docs"
        ? getDocsPagesForVersion(version)
        : [getSpecPageForVersion(version)],
    ]),
  ) as VersionedSubPages;

export const getRoadmapPage = (): SiteMapPage => ({
  ...getPage({ pathToDirectory: "roadmap", fileName: "00_index.mdx" }),
  subPages: getRoadmapSubPages(),
});

export const generateSiteMap = (): SiteMap => {
  const versionedSubPages = {
    docs: buildVersionedSubPages("docs"),
    spec: buildVersionedSubPages("spec"),
  };

  // The top-level "Docs" entry exposes the LATEST version as its default
  // sidebar tree (with the latest-versioned Specification page and the
  // unversioned Roadmap appended). Per-version trees live in
  // `versionedSubPages` and are looked up at render time by the route's
  // active version.
  const latestDocsSubPages = versionedSubPages.docs[LATEST_DOCS_VERSION];
  const latestSpecSubPage = versionedSubPages.spec[LATEST_DOCS_VERSION][0]!;

  return {
    pages: [
      {
        title: "Hub",
        href: "/hub",
      },
      {
        title: "Docs",
        href: "/docs",
        subPages: [
          ...latestDocsSubPages,
          latestSpecSubPage,
          getRoadmapPage(),
        ],
      },
    ],
    versionedSubPages,
  };
};
