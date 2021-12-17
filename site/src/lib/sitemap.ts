import { getAllPageStructures } from "../util/mdxUtils";

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
    title: "Introduction",
    href: "/spec/introduction",
    sections: [],
    subPages: [],
  },
  {
    title: "Quick Start Guide",
    href: "/spec/quick-start-guide",
    sections: [],
    subPages: [],
  },
];

export const getSpecSubPages = (): SiteMapPage[] => {
  const pageStructures = getAllPageStructures({ folderName: "spec" });

  return pageStructures.map(({ title, href, sections }) => ({
    title,
    href,
    sections:
      sections?.map(
        ({ title: sectionTitle, anchor: sectionAnchor, subSections }) => ({
          title: sectionTitle,
          anchor: sectionAnchor,
          subSections:
            subSections?.map(
              ({ title: subSectionTitle, anchor: subSectionAnchor }) => ({
                title: subSectionTitle,
                anchor: subSectionAnchor,
                subSections: [],
              }),
            ) || [],
        }),
      ) || [],
    subPages: [],
  }));
};

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
