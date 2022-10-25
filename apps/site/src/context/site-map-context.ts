import { createContext } from "react";

import { SiteMap } from "../lib/sitemap.js";

const SiteMapContext = createContext<SiteMap>({
  pages: [],
});

export default SiteMapContext;
