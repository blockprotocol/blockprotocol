import { createContext } from "react";

import { SiteMap } from "../lib/sitemap";

const SiteMapContext = createContext<SiteMap>({
  pages: [],
});

export default SiteMapContext;
