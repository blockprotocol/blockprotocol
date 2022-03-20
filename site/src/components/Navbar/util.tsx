import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { BlockHubIcon, SpecificationIcon, FontAwesomeIcon } from "../icons";

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
    <FontAwesomeIcon
      icon={faBookOpen}
      sx={{
        fontSize: 18,
      }}
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
