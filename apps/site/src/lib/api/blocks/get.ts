import path from "node:path";

import fs from "fs-extra";

import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, getDbBlocks } from "./db";

const localBlocks = fs.readJsonSync(
  path.resolve("blocks-data.json"),
) as ExpandedBlockMetadata[];

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  const allDbBlocks = await getDbBlocks({});

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return [...allDbBlocks, ...localBlocks] as ExpandedBlockMetadata[];
};

const featuredBlocks = new Set([
  "@alfie/github-pr-overview",
  "@hash/code",
  "@hash/shuffle",
]);

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  return localBlocks.filter((block) =>
    featuredBlocks.has(block.pathWithNamespace),
  );
};

export const getAllBlocksByUser = async (params: {
  shortname: string;
}): Promise<ExpandedBlockMetadata[]> => {
  const { shortname } = params;

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  const localUserBlocks = localBlocks.filter(
    ({ author }) => author === params.shortname,
  ) as ExpandedBlockMetadata[];

  const dbUserBlocks = await getDbBlocks({ shortname });

  return [...dbUserBlocks, ...localUserBlocks];
};

export const getBlockByUserAndName = async (params: {
  name: string;
  shortname: string;
}): Promise<ExpandedBlockMetadata | null> => {
  const { name, shortname } = params;
  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  const localBlock = (localBlocks.filter(
    ({ pathWithNamespace }) => pathWithNamespace === `@${shortname}/${name}`,
  )?.[0] ?? null) as ExpandedBlockMetadata | null;

  if (localBlock) {
    return localBlock;
  }

  return getDbBlock({ name, author: shortname });
};
