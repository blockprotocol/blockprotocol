import path from "node:path";

import fs from "fs-extra";
import matter from "gray-matter";
import { htmlToText } from "html-to-text";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";
import remarkParse from "remark-parse";
import slugify from "slugify";
import { unified } from "unified";

import {
  DOCS_VERSIONS,
  DocsVersion,
  fallbackVersionChain,
  VersionedSection,
} from "../lib/docs-versions";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";

type Node = {
  type: string;
  name?: string;
};

type TextNode = {
  value: string | TextNode;
} & Node;

const isTextNode = (node: Node | string): node is TextNode =>
  typeof node !== "string" && "value" in node;

type Parent = {
  children: (TextNode | Node)[];
} & Node;

const isParent = (node: Node): node is Parent => "children" in node;

type Heading = {
  type: "heading";
  depth: number;
} & Parent;

const isHeading = (node: Node): node is Heading => node.type === "heading";

type FAQ = {
  type: "mdxJsxFlowElement";
  name: "FAQ";
  attributes: {
    type: "mdxJsxAttribute";
    name: "question" | string;
    value: string;
  }[];
} & Parent;

const isFAQ = (node: Node): node is FAQ =>
  node.type === "mdxJsxFlowElement" && node.name === "FAQ";

type ParsedAST = {
  type: "root";
} & Parent;

// Parses the abstract syntax tree of a stringified MDX file
const parseAST = (mdxFileContent: string) =>
  unified().use(remarkParse).use(remarkMdx).parse(mdxFileContent) as ParsedAST;

// Recursively returns all the headings in an MDX AST
const getHeadingsFromParent = (parent: Parent): Heading[] =>
  parent.children
    .map((child) => {
      const subHeadings = isParent(child) ? getHeadingsFromParent(child) : [];
      if (isHeading(child)) {
        return [child];
      } else if (isFAQ(child)) {
        const heading: Heading = {
          type: "heading",
          /** @todo: don't assume that FAQ accordions are always headings at depth 3 */
          depth: 3,
          children: [
            {
              type: "text",
              value:
                child.attributes.find(({ name }) => name === "question")
                  ?.value ?? "Unknown",
            },
          ],
        };
        return [heading, ...subHeadings];
      }
      return subHeadings;
    })
    .flat();

// Parses the name from a MDX file name (removing the prefix index and the .mdx file extension)
const parseNameFromFileName = (fileName: string): string => {
  const matches = fileName.match(/^\d+[_-](.*?)\.(mdx|md)$/);

  if (!matches || matches.length < 2) {
    throw new Error(`Invalid MDX fileName: ${fileName}`);
  }

  return matches[1]!;
};

// Gets all hrefs corresponding to the MDX files in a directory
export const getAllPageHrefs = (params: { folderName: string }): string[] => {
  const { folderName } = params;

  const fileNames = fs.readdirSync(
    path.join(process.cwd(), `src/_pages/${folderName}`),
  );

  return fileNames.map((fileName) => {
    const name = parseNameFromFileName(fileName);

    return `/${folderName}${name === "index" ? "" : `/${name}`}`;
  });
};

// Serializes an MDX file
export const getSerializedPage = async (params: {
  pathToDirectory: string;
  parts: string[];
}): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> => {
  const { pathToDirectory, parts } = params;

  let mdxPath = path.join(process.cwd(), `src/_pages/${pathToDirectory}`);

  if (pathToDirectory === "roadmap") {
    if (parts.indexOf("index") === -1) {
      mdxPath = path.join(process.cwd(), `../../rfcs/text`);
    }
  }

  for (const part of parts) {
    const fileNames = await fs.readdir(mdxPath);
    const nextFileNamePart = fileNames.find(
      (fileName) =>
        fileName.endsWith(part) ||
        fileName.endsWith(`${part}.mdx`) ||
        fileName.endsWith(`${part}.md`),
    )!;
    mdxPath = path.join(mdxPath, nextFileNamePart);
  }

  if ((await fs.lstat(mdxPath)).isDirectory()) {
    mdxPath = path.join(mdxPath, "00_index.mdx");
  }

  const source = await fs.readFile(mdxPath);
  const { content, data } = matter(source);

  const serializedMdx = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkMdxDisableExplicitJsx, remarkGfm],
      rehypePlugins: [],
    },
    scope: data,
  });

  return serializedMdx;
};

/**
 * Resolves a versioned MDX page by walking the fallback version chain
 * starting at the requested version, returning both the serialized content
 * and the version that actually supplied it (so callers can show a banner
 * when the served version differs from what was requested).
 *
 * Throws if no version in the chain has the requested page.
 */
export const getSerializedPageForVersion = async (params: {
  section: VersionedSection;
  requestedVersion: DocsVersion;
  parts: string[];
}): Promise<{
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
  servedFromVersion: DocsVersion;
}> => {
  const { section, requestedVersion, parts } = params;

  for (const version of fallbackVersionChain(requestedVersion)) {
    try {
      const serializedPage = await getSerializedPage({
        pathToDirectory: `${section}/${version}`,
        parts,
      });
      return { serializedPage, servedFromVersion: version };
    } catch {
      // Try the next-older version.
    }
  }

  throw new Error(
    `No version of ${section}/${parts.join("/")} found in the fallback chain starting at ${requestedVersion}.`,
  );
};

// Recursively construct the text from leaf text nodes in an MDX AST
const getFullText = (node: Node): string =>
  [
    isTextNode(node)
      ? isTextNode(node.value)
        ? htmlToText(node.value.value as string)
        : node.value
      : "",
    ...(isParent(node) ? node.children.map(getFullText) : []),
  ].join("");

// Recursively construct the text from leaf text nodes in an MDX AST
const getVisibleText = (node: Node): string =>
  [
    isTextNode(node)
      ? isTextNode(node.value)
        ? node.value.value
        : node.value
      : "",
    ...(isParent(node) &&
    (node.type !== "mdxJsxTextElement" || node.name !== "Hidden")
      ? node.children.map(getVisibleText)
      : []),
  ].join("");

const getHeadingsFromMarkdown = (markdownFilePath: string): Heading[] => {
  const source = fs.readFileSync(path.join(process.cwd(), markdownFilePath));

  const { content } = matter(source);

  const ast = parseAST(content);

  const headings = getHeadingsFromParent(ast);

  return headings;
};

// Get the structure of a given MDX file in a given directory
export const getPage = (params: {
  pathToDirectory: string;
  fileName: string;
  isRfc?: boolean;
}): SiteMapPage => {
  const { pathToDirectory, fileName, isRfc = false } = params;

  const markdownFilePath = isRfc
    ? `../../rfcs/text/${fileName}`
    : `src/_pages/${pathToDirectory}/${fileName}`;

  const headings = getHeadingsFromMarkdown(markdownFilePath);

  const h1 = headings.find(({ depth }) => depth === 1);

  const title = h1 ? getVisibleText(h1) : "Unknown";

  const name = parseNameFromFileName(fileName);

  return {
    title,
    href: `/${pathToDirectory.replace(/\d+_/g, "")}${
      name === "index" ? "" : `/${slugify(name, { lower: true })}`
    }`,
    markdownFilePath,
    sections: headings
      .reduce<SiteMapPageSection[]>((prev, currentHeading) => {
        const slug = slugify(getFullText(currentHeading), {
          lower: true,
        });

        const newSection = {
          title: getVisibleText(currentHeading),
          anchor: slug,
          subSections: [],
        };

        if (currentHeading.depth === 2) {
          return [...prev, newSection];
        } else if (currentHeading.depth === 3) {
          return prev.length > 0
            ? [
                ...prev.slice(0, -1),
                {
                  ...prev[prev.length - 1]!,
                  subSections: [
                    ...(prev[prev.length - 1]!.subSections || []),
                    newSection,
                  ],
                },
              ]
            : prev;
        }

        return prev;
      }, [])
      .filter((heading) => heading.anchor !== "future-plans"),
    subPages: [],
  };
};

// Get the structure of a all MDX files in a given directory
export const getAllPages = (params: {
  pathToDirectory: string;
  filterIndexPage?: boolean;
  isRfc?: boolean;
}): SiteMapPage[] => {
  const { pathToDirectory, filterIndexPage = false, isRfc = false } = params;

  const thisPath = isRfc ? "../../rfcs/text" : `src/_pages/${pathToDirectory}`;

  const directoryItems = fs
    .readdirSync(path.join(process.cwd(), thisPath))
    .filter((item) => !item.startsWith("."))
    .filter((item) => !filterIndexPage || item !== "00_index.mdx");

  return directoryItems.flatMap((directoryItem) => {
    if (fs.lstatSync(`${thisPath}/${directoryItem}`).isDirectory()) {
      const indexPage = getPage({
        pathToDirectory: `${pathToDirectory}/${directoryItem}`,
        fileName: "00_index.mdx",
      });

      const subPages = getAllPages({
        pathToDirectory: `${pathToDirectory}/${directoryItem}`,
        filterIndexPage: true,
      });

      return {
        ...indexPage,
        subPages,
      };
    }

    return getPage({
      pathToDirectory,
      fileName: directoryItem,
      isRfc,
    });
  });
};

/**
 * Replaces the version segment in a `/docs/<v>/...` or `/spec/<v>/...` href
 * with `toVersion`. Hrefs that don't contain a recognized version segment
 * are returned unchanged.
 */
const rewriteHrefVersion = (href: string, toVersion: DocsVersion): string => {
  const segments = href.split("/");
  // segments[0] is "" (leading slash), segments[1] is the section,
  // segments[2] is the version if present.
  if (
    segments.length >= 3 &&
    (DOCS_VERSIONS as readonly string[]).includes(segments[2]!)
  ) {
    segments[2] = toVersion;
    return segments.join("/");
  }
  return href;
};

/**
 * Removes the version segment from a `/docs/<v>/...` or `/spec/<v>/...` href
 * so two pages from different versions can be compared by their "logical"
 * slug. Hrefs without a recognized version segment are returned unchanged.
 */
const stripVersionFromHref = (href: string): string => {
  const segments = href.split("/");
  if (
    segments.length >= 3 &&
    (DOCS_VERSIONS as readonly string[]).includes(segments[2]!)
  ) {
    segments.splice(2, 1);
    return segments.join("/");
  }
  return href;
};

const overlayPagesBySlug = (
  base: SiteMapPage[],
  overlay: SiteMapPage[],
): SiteMapPage[] => {
  const baseBySlug = new Map<string, SiteMapPage>();
  for (const page of base) {
    baseBySlug.set(stripVersionFromHref(page.href), page);
  }

  const result: SiteMapPage[] = [];
  const handledSlugs = new Set<string>();

  for (const overlayPage of overlay) {
    const slug = stripVersionFromHref(overlayPage.href);
    handledSlugs.add(slug);
    const basePage = baseBySlug.get(slug);

    if (basePage) {
      const mergedSubPages =
        overlayPage.subPages || basePage.subPages
          ? overlayPagesBySlug(
              basePage.subPages ?? [],
              overlayPage.subPages ?? [],
            )
          : undefined;

      result.push({
        ...overlayPage,
        subPages: mergedSubPages,
      });
    } else {
      result.push(overlayPage);
    }
  }

  for (const basePage of base) {
    const slug = stripVersionFromHref(basePage.href);
    if (!handledSlugs.has(slug)) {
      result.push(basePage);
    }
  }

  return result;
};

const rewriteAllHrefs = (
  pages: SiteMapPage[],
  toVersion: DocsVersion,
): SiteMapPage[] =>
  pages.map((page) => ({
    ...page,
    href: rewriteHrefVersion(page.href, toVersion),
    version: toVersion,
    subPages: page.subPages
      ? rewriteAllHrefs(page.subPages, toVersion)
      : undefined,
  }));

/**
 * Returns the union of pages reachable for a section at the requested
 * version: pages defined under that version, plus any pages inherited
 * from older versions (newest provider wins). All hrefs in the result use
 * the requested version's prefix so links navigate within that version.
 *
 * Versions are iterated oldest-first so that newer pages overlay older ones
 * via `overlayPagesBySlug`.
 */
export const unionVersionedPages = (params: {
  section: VersionedSection;
  forVersion: DocsVersion;
  filterIndexPage?: boolean;
}): SiteMapPage[] => {
  const { section, forVersion, filterIndexPage = false } = params;

  const chain = fallbackVersionChain(forVersion);

  let merged: SiteMapPage[] = [];
  for (const version of [...chain].reverse()) {
    let pagesForVersion: SiteMapPage[];
    try {
      pagesForVersion = getAllPages({
        pathToDirectory: `${section}/${version}`,
        filterIndexPage,
      });
    } catch {
      // The version's folder doesn't exist or is unreadable — skip.
      continue;
    }
    merged = overlayPagesBySlug(merged, pagesForVersion);
  }

  return rewriteAllHrefs(merged, forVersion);
};

export const getRoadmapSubPages = (): SiteMapPage[] => {
  const pathToDirectory = "roadmap";

  const markdownFilePath = `src/_pages/${pathToDirectory}/00_index.mdx`;

  const headings = getHeadingsFromMarkdown(markdownFilePath);

  const depthThreeHeadings = headings.filter((heading) => heading.depth === 3);

  const proposedChanges = headings.find((heading) => {
    return (
      slugify(getFullText(heading), {
        lower: true,
      }) === "future-plans"
    );
  }) as Heading;

  return [
    {
      title: getVisibleText(proposedChanges),
      href: `/${pathToDirectory}#${slugify(getFullText(proposedChanges), {
        lower: true,
      })}`,
      markdownFilePath,
      subPages: depthThreeHeadings.map((currentHeading) => {
        const slug = slugify(getFullText(currentHeading), {
          lower: true,
        });
        return {
          title: getVisibleText(currentHeading),
          href: `/${pathToDirectory}#${slug}`,
          markdownFilePath,
          subPages:
            slug === "rfcs"
              ? getAllPages({
                  pathToDirectory,
                  filterIndexPage: true,
                  isRfc: true,
                }).map((page) => ({
                  ...page,
                  title: page.href.replace(`/${pathToDirectory}/`, ""),
                }))
              : [],
        };
      }),
    },
  ];
};
