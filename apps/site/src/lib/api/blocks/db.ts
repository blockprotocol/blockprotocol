import groupBy from "lodash/groupBy";
import semverRCompare from "semver/functions/rcompare";

import { ExpandedBlockMetadata } from "../../blocks";
import { connectToDatabase } from "../mongodb";
import { blockDownloadsCollectionName, blocksDbCollectionName } from "./shared";

const defaultProjection = { _id: 0 };

const weeklyDownloadCountAggregationStage = [
  {
    $lookup: {
      from: blockDownloadsCollectionName,
      let: { id: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$$id", "$blockId"] },
            downloadedAt: {
              $gte: new Date(
                new Date().valueOf() - 7 * 60 * 60 * 24 * 1000,
              ).toISOString(),
            },
          },
        },
      ],
      as: "weeklyDownloads",
    },
  },
  { $addFields: { downloads: { weekly: { $size: "$weeklyDownloads" } } } },
  { $project: { weeklyDownloads: 0, ...defaultProjection } },
];

const pickLatestVersion = (
  blocks: ExpandedBlockMetadata[],
): ExpandedBlockMetadata | null =>
  [...blocks].sort((a, b) => semverRCompare(a.version, b.version))[0] ?? null;

export const getDbBlocksVersions = async (filter: { shortname?: string }) => {
  const { db } = await connectToDatabase();

  return db
    .collection(blocksDbCollectionName)
    .aggregate<ExpandedBlockMetadata>([
      {
        $match: filter.shortname ? { author: filter.shortname } : {},
      },
      ...weeklyDownloadCountAggregationStage,
    ])
    .toArray();
};

export const getDbBlocks = async (filter: {
  shortname?: string;
}): Promise<ExpandedBlockMetadata[]> => {
  const groupedBlocks = Object.values(
    groupBy(
      await getDbBlocksVersions(filter),
      ({ author, name }) => `${author}/${name}`,
    ),
  );

  return groupedBlocks.map((blocks) => pickLatestVersion(blocks)!);
};

export const getDbBlockVersions = async (
  filter:
    | {
        author: string;
        name: string;
      }
    | { npmPackageName: string },
) => {
  const { db } = await connectToDatabase();

  return (
    (await db
      .collection(blocksDbCollectionName)
      .aggregate<ExpandedBlockMetadata>([
        { $match: filter },
        ...weeklyDownloadCountAggregationStage,
      ])
      .toArray()) ?? null
  );
};

/** Returns the latest available block version (highest semver value) */
export const getDbBlock = async (
  filter:
    | {
        author: string;
        name: string;
      }
    | { npmPackageName: string },
) => pickLatestVersion(await getDbBlockVersions(filter));

export const upsertBlockToDb = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

  const { author, name, version } = block;

  return await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .replaceOne({ author, name, version }, block, { upsert: true });
};
