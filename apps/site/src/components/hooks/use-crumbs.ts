import { BlockMetadata } from "@blockprotocol/core";
import { useMemo } from "react";

import { isDocsVersion, isVersionedSection } from "../../lib/docs-versions";
import { SiteMap, SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { itemIsPage } from "../navbar/util";
import { generatePathWithoutParams } from "../shared";

const findCrumbs = (params: {
  asPath: string;
  item: SiteMapPage | SiteMapPageSection;
  parents?: (SiteMapPage | SiteMapPageSection)[];
  parentHref?: string;
}): (SiteMapPage | SiteMapPageSection)[] | null => {
  const { parents, item, asPath, parentHref } = params;

  const pathWithoutParams = generatePathWithoutParams(asPath);

  for (const section of (itemIsPage(item) ? item.sections : item.subSections) ??
    []) {
    const crumbs = findCrumbs({
      asPath,
      item: section,
      parents: [...(parents || []), item],
      parentHref: itemIsPage(item) ? item.href : parentHref,
    });

    if (crumbs) {
      return crumbs;
    }
  }

  if (itemIsPage(item)) {
    for (const page of item.subPages ?? []) {
      const crumbs = findCrumbs({
        asPath,
        item: page,
        parents: [...(parents || []), item],
      });

      if (crumbs) {
        return crumbs;
      }
    }
  }

  const href = itemIsPage(item) ? item.href : `${parentHref}#${item.anchor}`;

  if (
    pathWithoutParams === href ||
    (itemIsPage(item) && pathWithoutParams === `${href}#`)
  ) {
    return [...(parents || []), item];
  }

  return null;
};

export type Crumb = SiteMapPage | SiteMapPageSection;

const VERSIONED_DOC_ROUTES = new Set([
  "/docs/[[...docs-slug]]",
  "/spec/[[...spec-slug]]",
]);

/**
 * Builds the "Docs"-rooted page list that `findCrumbs` walks when the
 * request is on `/docs/<v>/…` or `/spec/<v>/…`.
 *
 * The default `pages` tree exposes only the LATEST version's docs/spec
 * subpages (see `generateSiteMap`), so when a user is on an older version
 * the path-match never succeeds and no crumbs render. When we can identify
 * the version, we synthesise a Docs entry whose children come from that
 * version's tree — keeping crumbs working on `/docs/0.3/types`, etc.
 *
 * Falls back to the pre-existing behaviour (filter for "Docs"/"Specification"
 * top-level entries) when the version can't be identified or per-version
 * data isn't available (e.g. older callers that don't pass it through).
 */
const buildVersionedSearchRoot = (params: {
  asPath: string;
  pages: SiteMapPage[];
  versionedSubPages?: SiteMap["versionedSubPages"];
}): SiteMapPage[] => {
  const { asPath, pages, versionedSubPages } = params;

  const [section, version] = generatePathWithoutParams(asPath)
    .split("/")
    .filter((segment) => segment !== "");

  if (
    versionedSubPages &&
    section &&
    isVersionedSection(section) &&
    version &&
    isDocsVersion(version)
  ) {
    const docsForVersion = versionedSubPages.docs[version] ?? [];
    const specForVersion = versionedSubPages.spec[version] ?? [];
    return [
      {
        title: "Docs",
        href: "/docs",
        subPages: [...docsForVersion, ...specForVersion],
      },
    ];
  }

  return pages.filter(({ title }) => ["Specification", "Docs"].includes(title));
};

export const useCrumbs = (
  pages: SiteMapPage[],
  asPath: string,
  route: string = "/docs/[[...docs-slug]]",
  blockMetadata?: BlockMetadata,
  versionedSubPages?: SiteMap["versionedSubPages"],
): Crumb[] => {
  return useMemo(() => {
    if (VERSIONED_DOC_ROUTES.has(route)) {
      const breadCrumbPages = buildVersionedSearchRoot({
        asPath,
        pages,
        versionedSubPages,
      });

      for (const page of breadCrumbPages) {
        const maybeCrumbs = findCrumbs({ asPath, item: page });

        if (maybeCrumbs) {
          return maybeCrumbs;
        }
      }
    } else if (
      route === "/[shortname]/blocks/[block-slug]" &&
      blockMetadata?.displayName
    ) {
      return [
        { title: "Home", href: "/", subPages: [], sections: [] },
        { title: "Hub", href: "/hub", subPages: [], sections: [] },
        {
          title: blockMetadata.displayName,
          href: asPath,
          subPages: [],
          sections: [],
        },
      ];
    }

    return [];
  }, [asPath, pages, route, blockMetadata, versionedSubPages]);
};
