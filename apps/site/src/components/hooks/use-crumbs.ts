import { useMemo } from "react";

import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
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

export const useCrumbs = (pages: SiteMapPage[], asPath: string) =>
  useMemo(() => {
    const breadCrumbPages = pages.filter(({ title }) =>
      ["Specification", "Documentation"].includes(title),
    );

    for (const page of breadCrumbPages) {
      const maybeCrumbs = findCrumbs({ asPath, item: page });

      if (maybeCrumbs) {
        return maybeCrumbs;
      }
    }
    return [];
  }, [asPath, pages]);
