import { getAllPages, getPage } from "../util/mdxUtils";

export type SiteMapPageSection = {
  title: string;
  anchor: string;
  subSections: SiteMapPageSection[];
};

export type SiteMapPage = {
  title: string;
  href: string;
  subPages: SiteMapPage[];
  sections: SiteMapPageSection[];
};

export type SiteMap = {
  pages: SiteMapPage[];
};

export const getDocumentationSubPages = (): SiteMapPage[] => [
  {
    ...getPage({
      pathToDirectory: "docs",
      fileName: "0_index.mdx",
    }),
    href: "/docs",
    title: "Introduction",
  },
  {
    ...getPage({
      pathToDirectory: "docs",
      fileName: "1_developing-blocks.mdx",
    }),
    href: "/docs/developing-blocks",
    title: "Developing Blocks",
  },
  {
    ...getPage({
      pathToDirectory: "docs",
      fileName: "2_publishing-blocks.mdx",
    }),
    href: "/docs/publishing-blocks",
    title: "Publishing Blocks",
  },
  {
    ...getPage({
      pathToDirectory: "docs",
      fileName: "3_embedding-blocks.mdx",
    }),
    href: "/docs/embedding-blocks",
    title: "Embedding Blocks",
  },
];

export const getSpecSubPages = (): SiteMapPage[] =>
  getAllPages({ pathToDirectory: "spec" });

export const generateSiteMap = (): SiteMap => ({
  pages: [
    {
      title: "Block Hub",
      href: "/hub",
      sections: [],
      subPages: [],
    },
    {
      title: "Documentation",
      href: "/docs",
      sections: [],
      subPages: getDocumentationSubPages(),
    },
    {
      title: "Specification",
      href: "/spec",
      sections: [],
      subPages: getSpecSubPages(),
    },
  ],
});
