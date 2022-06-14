import fs from "fs-extra";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "node:path";
import remarkMdx from "remark-mdx";
import remarkMdxDisableExplicitJsx from "remark-mdx-disable-explicit-jsx";
import remarkParse from "remark-parse";
import slugify from "slugify";
import { unified } from "unified";

import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";

type Node = {
  type: string;
  name?: string;
};

type TextNode = {
  value: string;
} & Node;

const isTextNode = (node: Node): node is TextNode => "value" in node;

type Parent = {
  children: Node[];
} & Node;

const isParent = (node: Node): node is Parent => "children" in node;

type Heading = {
  type: "heading";
  depth: number;
} & Parent;

const isHeading = (node: Node): node is Heading => node.type === "heading";

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
      if (isHeading(child)) {
        return [child];
      } else if (isParent(child)) {
        return child.children
          .filter(isParent)
          .map(getHeadingsFromParent)
          .flat();
      }
      return [];
    })
    .flat();

// Parses the name from a MDX file name (removing the prefix index and the .mdx file extension)
const parseNameFromFileName = (fileName: string): string => {
  const matches = fileName.match(/^\d+_(.*?)\.mdx$/);

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
  fileNameWithoutIndex: string;
}): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> => {
  const { pathToDirectory, fileNameWithoutIndex } = params;

  const fileNames = await fs.readdir(
    path.join(process.cwd(), `src/_pages/${pathToDirectory}`),
  );

  const fileName = fileNames.find((fullFileName) =>
    fullFileName.endsWith(`${fileNameWithoutIndex}.mdx`),
  );

  const source = await fs.readFile(
    path.join(process.cwd(), `src/_pages/${pathToDirectory}/${fileName}`),
  );

  const { content, data } = matter(source);

  const serializedMdx = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkMdxDisableExplicitJsx],
      rehypePlugins: [],
    },
    scope: data,
  });

  return serializedMdx;
};

// Recursively construct the text from leaf text nodes in an MDX AST
const getFullText = (node: Node): string =>
  [
    isTextNode(node) ? node.value : "",
    ...(isParent(node) ? node.children.map(getFullText) : []),
  ].join("");

// Recursively construct the text from leaf text nodes in an MDX AST
const getVisibleText = (node: Node): string =>
  [
    isTextNode(node) ? node.value : "",
    ...(isParent(node) &&
    (node.type !== "mdxJsxTextElement" || node.name !== "Hidden")
      ? node.children.map(getVisibleText)
      : []),
  ].join("");

// Get the structure of a given MDX file in a given directory
export const getPage = (params: {
  pathToDirectory: string;
  fileName: string;
}): SiteMapPage => {
  const { pathToDirectory, fileName } = params;

  const source = fs.readFileSync(
    path.join(process.cwd(), `src/_pages/${pathToDirectory}/${fileName}`),
  );

  const { content } = matter(source);

  const ast = parseAST(content);

  const headings = getHeadingsFromParent(ast);

  const h1 = headings.find(({ depth }) => depth === 1);

  const title = h1 ? getVisibleText(h1) : "Unknown";

  const name = parseNameFromFileName(fileName);

  return {
    title,
    href: `/${pathToDirectory}${
      name === "index" ? "" : `/${slugify(name, { lower: true })}`
    }`,
    sections: headings.reduce<SiteMapPageSection[]>((prev, currentHeading) => {
      const newSection = {
        title: getVisibleText(currentHeading),
        anchor: slugify(getFullText(currentHeading), {
          lower: true,
        }),
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
      } else if (currentHeading.depth === 4) {
        if (prev.length > 0) {
          const heading2 = prev[prev.length - 1]!;
          const heading3 =
            heading2.subSections[heading2.subSections.length - 1]!;

          return [
            ...prev.slice(0, -1),
            {
              ...heading2,
              subSections: [
                ...(heading2.subSections || []).slice(0, -1),
                {
                  ...heading3,
                  subSections: [...(heading3.subSections || []), newSection],
                },
              ],
            },
          ];
        } else {
          return prev;
        }
      }
      return prev;
    }, []),
    subPages: [],
  };
};

// Get the structure of a all MDX files in a given directory
export const getAllPages = (params: {
  pathToDirectory: string;
}): SiteMapPage[] => {
  const { pathToDirectory } = params;

  const fileNames = fs.readdirSync(
    path.join(process.cwd(), `src/_pages/${pathToDirectory}`),
  );

  return fileNames.map((fileName) =>
    getPage({
      pathToDirectory,
      fileName,
    }),
  );
};
