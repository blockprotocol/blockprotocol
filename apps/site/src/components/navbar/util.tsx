import { ReactElement } from "react";

import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";
import { BlockProtocolIcon } from "../icons";
import { OpenBookIcon } from "../icons/open-book-icon";

export const itemIsPage = (
  item: SiteMapPage | SiteMapPageSection,
): item is SiteMapPage => "href" in item;

export const NAVBAR_LINK_ICONS: Record<string, ReactElement> = {
  Hub: <BlockProtocolIcon sx={{ fontSize: 14 }} />,
  Docs: <OpenBookIcon sx={{ fontSize: 16 }} />,
};
