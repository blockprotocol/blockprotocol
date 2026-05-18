import path from "node:path";

import fs from "fs-extra";

import type { ExpandedBlockMetadata } from "./blocks";

export type StaticUser = {
  shortname: string;
  preferredName: string;
  userAvatarUrl?: string;
};

type HubSnapshot = {
  generatedAt: string;
  source: string;
  users: StaticUser[];
  blocks: ExpandedBlockMetadata[];
};

let cachedSnapshot: HubSnapshot | undefined;

const loadSnapshot = (): HubSnapshot => {
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  const snapshotPath = path.resolve(process.cwd(), "hub-snapshot.json");
  if (!fs.pathExistsSync(snapshotPath)) {
    cachedSnapshot = {
      generatedAt: new Date(0).toISOString(),
      source: "missing",
      users: [],
      blocks: [],
    };
  } else {
    cachedSnapshot = fs.readJsonSync(snapshotPath) as HubSnapshot;
  }

  return cachedSnapshot;
};

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  return loadSnapshot().blocks;
};

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  const all = loadSnapshot().blocks;

  const featuredIds: { author: string; name: string }[] = [
    { author: "hash", name: "address" },
    { author: "hash", name: "how-to" },
    { author: "hash", name: "ai-image" },
  ];

  return featuredIds
    .map(({ author, name }) =>
      all.find((block) => block.author === author && block.name === name),
    )
    .filter((block): block is ExpandedBlockMetadata => Boolean(block));
};

export const getAllBlocksByUser = async (params: {
  shortname: string;
}): Promise<ExpandedBlockMetadata[]> => {
  const { shortname } = params;
  return loadSnapshot().blocks.filter((block) => block.author === shortname);
};

export const getBlockByUserAndName = async (params: {
  name: string;
  shortname: string;
}): Promise<ExpandedBlockMetadata | null> => {
  const { name, shortname } = params;
  return (
    loadSnapshot().blocks.find(
      (block) => block.author === shortname && block.name === name,
    ) ?? null
  );
};

export const getStaticUser = (params: {
  shortname: string;
}): StaticUser | null => {
  const { shortname } = params;
  return (
    loadSnapshot().users.find((user) => user.shortname === shortname) ?? null
  );
};
