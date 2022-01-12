import { Icon } from "@mui/material";

import { BlockHubIcon } from "../SvgIcon/BlockHubIcon";
import { SpecificationIcon } from "../SvgIcon/SpecificationIcon";

import { SiteMapPage, SiteMapPageSection } from "../../lib/sitemap";

export const itemIsPage = (
  item: SiteMapPage | SiteMapPageSection,
): item is SiteMapPage => "href" in item;

export const NAVBAR_LINK_ICONS: Record<string, JSX.Element> = {
  "Block Hub": (
    <BlockHubIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
  Documentation: (
    <Icon
      className="fas fa-book-open"
      sx={{
        fontSize: 18,
      }}
      fontSize="inherit"
    />
  ),
  Specification: (
    <SpecificationIcon
      sx={{
        width: 18,
        height: 18,
      }}
    />
  ),
};
