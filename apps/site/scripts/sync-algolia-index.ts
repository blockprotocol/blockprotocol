import path from "node:path";
import { fileURLToPath } from "node:url";

import algoliasearch from "algoliasearch";
import * as envalid from "envalid";
import fs from "fs-extra";
import matter from "gray-matter";

import siteMap from "../site-map.json" assert { type: "json" };
import { SiteMapPage } from "../src/lib/sitemap";

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

type AlgoliaRecord = {
  content: string;
  objectID: string;
  type: string;
  title?: string;
  description?: string;
  slug?: string;
  tags?: Array<string>;
};

const flattenSitemapPages = (pages: SiteMapPage[]): SiteMapPage[] => {
  const result: SiteMapPage[] = [];

  for (const page of pages) {
    result.push(page, ...flattenSitemapPages(page.subPages ?? []));
  }

  return result;
};

const markdownPageInfos = flattenSitemapPages(siteMap.pages).filter(
  (page): page is SiteMapPage & { markdownFilePath: string } =>
    Boolean(page.markdownFilePath),
);

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

  const indexObjects: AlgoliaRecord[] = [];

  for (const markdownPageInfo of markdownPageInfos) {
    const markdown = await fs.readFile(
      path.resolve(
        monorepoRoot,
        "apps/site",
        markdownPageInfo.markdownFilePath,
      ),
      "utf8",
    );

    const matterData = matter(markdown) as {
      content: string;
      data: Record<string, string>;
    };

    const type = markdownPageInfo.href.startsWith("/docs/spec")
      ? "spec"
      : "docs";

    indexObjects.push({
      ...matterData.data,
      content: matterData.content,
      objectID: `${type}/${markdownPageInfo.href}`,
      title: markdownPageInfo.title,
      slug: markdownPageInfo.href,
      type,
    });
  }

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
