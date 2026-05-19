import { DocsVersion, versionsNewerThan } from "../lib/docs-versions";
import { SiteMapPage, VersionedSubPages } from "../lib/sitemap";

const flattenPages = (pages: SiteMapPage[]): SiteMapPage[] =>
  pages.flatMap((page) => [page, ...flattenPages(page.subPages ?? [])]);

/**
 * Looks up the requested pathname across all versions newer than
 * `requestedVersion` (newest-first), returning the href of the most-recent
 * version that defines the same slug AND marks it `hiddenFromSidebar`.
 *
 * That hidden newer page is, by convention, the deprecation tombstone — it
 * carries the explanatory note about why the page was removed. Callers use
 * the returned href to surface a banner on the older, still-rendered copy.
 *
 * Returns `null` when no newer version hides the page (i.e. either the page
 * is still current, or no newer version exists yet).
 */
export const findDeprecatedNoticeHref = (params: {
  versionedSubPages: VersionedSubPages;
  section: "spec" | "docs";
  requestedVersion: DocsVersion;
  pathname: string;
}): string | null => {
  const { versionedSubPages, section, requestedVersion, pathname } = params;
  const requestedPrefix = `/${section}/${requestedVersion}`;

  for (const newerVersion of versionsNewerThan(requestedVersion)) {
    const newerPrefix = `/${section}/${newerVersion}`;
    const newerPathname = pathname.replace(requestedPrefix, newerPrefix);

    const flat = flattenPages(versionedSubPages[newerVersion] ?? []);
    const match = flat.find(({ href }) => href === newerPathname);

    if (match?.hiddenFromSidebar) {
      return match.href;
    }
  }

  return null;
};
