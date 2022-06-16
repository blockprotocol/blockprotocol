import algoliasearch from "algoliasearch";
import * as envalid from "envalid";
import fs from "fs-extra";
import matter from "gray-matter";
import path from "node:path";
import { fileURLToPath } from "node:url";

import siteMap from "../site-map.json" assert { type: "json" };

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

type DocsFrontMatter = {
  content: string;
  data: Record<string, string>;
};

type BlockProtocolFileTypes = "spec" | "docs";

type FileTypeAndPaths = {
  inputPath: string;
  outputPath: string;
  type: BlockProtocolFileTypes;
};

const getFileInfos = (
  dirPath: string,
  arrayOfFiles: Array<{
    inputPath: string;
    outputPath: string;
    type: BlockProtocolFileTypes;
  }>,
  type: BlockProtocolFileTypes,
): FileTypeAndPaths[] => {
  const files = fs.readdirSync(dirPath);

  const newArrayOfFiles: FileTypeAndPaths[] = [];

  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      // the only subfolder, 3_spec, is indexed as a different type
      return;
    }

    const inputPath = path.join(dirPath, "/", file);
    const outputPath = `.\\output\\${path.join(
      "./output/",
      dirPath,
      "/",
      file,
    )}`;
    if (inputPath.endsWith(".md") || inputPath.endsWith(".mdx")) {
      newArrayOfFiles.push({ inputPath, outputPath, type });
    }
  });

  return newArrayOfFiles;
};

type AlgoliaRecord = {
  content: string;
  objectID: string;
  type: string;
  title?: string;
  description?: string;
  slug?: string;
  tags?: Array<string>;
};

const generateAlgoliaRecords: () => AlgoliaRecord[] = () => {
  const getFormattedData = (
    matterData: DocsFrontMatter,
    type: BlockProtocolFileTypes,
    fileIndex: number,
  ): AlgoliaRecord => {
    const docsRoot = siteMap.pages.find((page) => {
      return page.href === "/docs";
    });
    if (!docsRoot) {
      throw new Error("Cannot find /docs root page in sitemap");
    }

    const siteMapData =
      type === "docs"
        ? docsRoot
        : docsRoot.subPages.find((subPage) => subPage.href === "/docs/spec");

    if (!siteMapData) {
      throw new Error("Unexpected empty siteMapData");
    }

    const subPageData = siteMapData.subPages[fileIndex]!;

    const appendData = {
      ...matterData.data,
      content: matterData.content,
      objectID: `${type}/${subPageData.href}`,
      title: subPageData.title,
      slug: subPageData.href,
      type,
    };

    return appendData;
  };

  const specFiles = getFileInfos(
    path.resolve(monorepoRoot, "site/src/_pages/docs/3_spec"),
    [],
    "spec",
  );
  const docsFiles = getFileInfos(
    path.resolve(monorepoRoot, "site/src/_pages/docs"),
    [],
    "docs",
  );

  const specData = specFiles.map((filePath, fileIndex) => {
    const file = fs.readFileSync(filePath.inputPath, "utf8");

    const grayMatterData = matter(file) as unknown as DocsFrontMatter;

    return getFormattedData(grayMatterData, filePath.type, fileIndex);
  });

  const docsData = docsFiles
    .map((filePath, fileIndex) => {
      const file = fs.readFileSync(filePath.inputPath, "utf8");

      const grayMatterData = matter(file) as unknown as DocsFrontMatter;

      const data = getFormattedData(grayMatterData, filePath.type, fileIndex);

      if (filePath.type === "docs" && data.slug === "/docs/spec") {
        // avoid double counting the spec root, which will be indexed as a 'spec' type
        return null;
      }
      return data;
    })
    .filter((file): file is AlgoliaRecord => !!file);

  return [...specData, ...docsData];
};

const script = async () => {
  console.log("Syncing Algolia index");

  const env = envalid.cleanEnv(process.env, {
    ALGOLIA_PROJECT: envalid.str({
      desc: "Algolia app id",
      example: "A1B2C3D4C5D6",
      docs: "https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/javascript/?client=javascript",
    }),
    ALGOLIA_WRITE_KEY: envalid.str({
      desc: "Algolia app API key with write permissions (32-char HEX)",
      docs: "https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/javascript/?client=javascript",
    }),
  });

  const client = algoliasearch(env.ALGOLIA_PROJECT, env.ALGOLIA_WRITE_KEY);

  const index = client.initIndex("blockprotocol");

  let oldIndexObjects: Array<{ objectID: string }> = [];

  await index.browseObjects({
    query: "", // Empty query will match all records
    attributesToRetrieve: ["objectID"],
    batch: (batch) => {
      oldIndexObjects = oldIndexObjects.concat(batch);
    },
  });

  const indexObjects: AlgoliaRecord[] = generateAlgoliaRecords();

  const indexObjectLookup: Record<string, AlgoliaRecord> = {};

  indexObjects.forEach((indexObject) => {
    indexObjectLookup[indexObject.objectID] = indexObject;
  });

  const objectIDsToDelete: string[] = [];

  oldIndexObjects.forEach(({ objectID }) => {
    if (!indexObjectLookup[objectID]) {
      objectIDsToDelete.push(objectID);
    }
  });

  await index.deleteObjects(objectIDsToDelete);

  await index.saveObjects(indexObjects);

  console.log("Algolia index updated.");
};

await script();
