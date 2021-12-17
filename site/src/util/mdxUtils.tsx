import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import matter from "gray-matter";
import { readFileSync, readdirSync } from "fs";
import unified from "unified";
/** @todo: figure out how to get or declare the necessary types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkMdx from "remark-mdx";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkParse from "remark-parse";
import slugify from "slugify";
import { SiteMapPage, SiteMapPageSection } from "../lib/sitemap";

type FolderName = "spec" | "docs";

type Node = {
  type: string;
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
const parseNameFromFileName = (fileName: string) => {
  const matches = fileName.match(/^\d+_(.*?)\.mdx$/);

  if (!matches || matches.length < 2) {
    throw new Error(`Invalid MDX fileName: ${fileName}`);
  }

  return matches[1];
};

// Gets all hrefs corresponding to the MDX files in a directory
export const getAllPageHrefs = (params: {
  folderName: FolderName;
}): string[] => {
  const { folderName } = params;

  const fileNames = readdirSync(
    path.join(process.cwd(), `src/_pages/${folderName}`),
  );

  return fileNames.map((fileName) => {
    const name = parseNameFromFileName(fileName);

    return `/${folderName}${name === "index" ? "" : `/${name}`}`;
  });
};

// Serializes an MDX file
export const getSerializedPage = async (params: {
  folderName: FolderName;
  fileNameWithoutIndex: string;
}): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> => {
  const { folderName, fileNameWithoutIndex } = params;

  const fileNames = readdirSync(
    path.join(process.cwd(), `src/_pages/${folderName}`),
  );

  const fileName = fileNames.find((fullFileName) =>
    fullFileName.endsWith(`${fileNameWithoutIndex}.mdx`),
  );

  const source = readFileSync(
    path.join(process.cwd(), `src/_pages/${folderName}/${fileName}`),
  );

  const { content, data } = matter(source);

  const serializedMdx = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  });

  return serializedMdx;
};

// Recursively construct the text from leaf text nodes in an MDX AST
const getText = (node: Node): string =>
  [
    isTextNode(node) ? node.value : "",
    ...(isParent(node) ? node.children.map(getText) : []),
  ].join("");

// Get the structure of a given MDX file in a given directory
const getPageStructure = (params: {
  folderName: string;
  fileName: string;
}): SiteMapPage => {
  const { folderName, fileName } = params;

  const source = readFileSync(
    path.join(process.cwd(), `src/_pages/${folderName}/${fileName}`),
  );

  const { content } = matter(source);

  const ast = parseAST(content);

  const headings = getHeadingsFromParent(ast);

  const h1 = headings.find(({ depth }) => depth === 1);

  if (!h1) {
    throw new Error("Need H1 to determine title of page");
  }

  const title = getText(h1);

  const name = parseNameFromFileName(fileName);

  return {
    title,
    href: `/spec${
      name === "index" ? "" : `/${slugify(name, { lower: true })}`
    }`,
    sections: headings.reduce<SiteMapPageSection[]>((prev, currentHeading) => {
      if (currentHeading.depth === 2) {
        const sectionTitle = getText(currentHeading);
        return [
          ...prev,
          {
            title: sectionTitle,
            anchor: slugify(sectionTitle, { lower: true }),
            subSections: [],
          },
        ];
      } else if (currentHeading.depth === 3) {
        const subSectionTitle = getText(currentHeading);

        return prev.length > 0
          ? [
              ...prev.slice(0, -1),
              {
                ...prev[prev.length - 1],
                subSections: [
                  ...(prev[prev.length - 1].subSections || []),
                  {
                    title: subSectionTitle,
                    anchor: slugify(subSectionTitle, { lower: true }),
                    subSections: [],
                  },
                ],
              },
            ]
          : prev;
      }
      return prev;
    }, []),
    subPages: [],
  };
};

// Get the structure of a all MDX files in a given directory
export const getAllPageStructures = (params: {
  folderName: FolderName;
}): SiteMapPage[] => {
  const { folderName } = params;

  const fileNames = readdirSync(
    path.join(process.cwd(), `src/_pages/${folderName}`),
  );

  return fileNames.map((fileName) =>
    getPageStructure({
      folderName,
      fileName,
    }),
  );
};
