import { getAllPages, getPage } from "../util/mdx-utils";

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

export const getDocumentationSubPages = (): SiteMapPage[] =>
  getAllPages({ pathToDirectory: "docs" });

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
