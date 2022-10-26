import { createContext } from "react";

import { SiteMap } from "../lib/sitemap.js";

export const SiteMapContext = createContext<SiteMap>({
  pages: [],
});
