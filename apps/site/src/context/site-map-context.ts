import { createContext } from "react";

import { DOCS_VERSIONS } from "../lib/docs-versions";
import { SiteMap } from "../lib/sitemap";

const emptyVersionedSubPages = Object.fromEntries(
  DOCS_VERSIONS.map((version) => [version, []]),
) as unknown as SiteMap["versionedSubPages"]["docs"];

const SiteMapContext = createContext<SiteMap>({
  pages: [],
  versionedSubPages: {
    docs: emptyVersionedSubPages,
    spec: emptyVersionedSubPages,
  },
});

export default SiteMapContext;
