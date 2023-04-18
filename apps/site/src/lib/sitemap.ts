import { getAllPages, getPage, getRoadmapPages } from "../util/mdx-utils";

export type SiteMapPageSection = {
  title: string;
  anchor: string;
  subSections: SiteMapPageSection[];
};

export type SiteMapPage = {
  title: string;
  href: string;
  markdownFilePath?: string;
  subPages?: SiteMapPage[];
  sections?: SiteMapPageSection[];
};

export type SiteMap = {
  pages: SiteMapPage[];
};

export const getDocumentationSubPages = (): SiteMapPage[] =>
  getAllPages({ pathToDirectory: "docs" });

export const getSpecPage = (): SiteMapPage => ({
  ...getPage({ pathToDirectory: "spec", fileName: "00_index.mdx" }),
  subPages: getAllPages({ pathToDirectory: "spec", filterIndexPage: true }),
});

export const getRoadmapPage = (): SiteMapPage => ({
  ...getPage({ pathToDirectory: "roadmap", fileName: "00_index.mdx" }),
  subPages: getRoadmapPages(),
});

export const getLegalSubPages = (): SiteMapPage[] =>
  getAllPages({ pathToDirectory: "legal" });

export const generateSiteMap = (): SiteMap => ({
  pages: [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Hub",
      href: "/hub",
    },
    {
      title: "Docs",
      href: "/docs",
      subPages: [
        ...getDocumentationSubPages(),
        getSpecPage(),
        getRoadmapPage(),
      ],
    },
    {
      title: "Legal",
      href: "/legal",
      subPages: getLegalSubPages(),
    },
  ],
});
