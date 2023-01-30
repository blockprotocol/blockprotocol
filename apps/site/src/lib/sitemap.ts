import { getAllPages } from "../util/mdx-utils";

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

export const generateSiteMap = (): SiteMap => ({
  pages: [
    {
      title: "Hub",
      href: "/hub",
    },
    {
      title: "Documentation",
      href: "/docs",
      subPages: getDocumentationSubPages(),
    },
  ],
});
