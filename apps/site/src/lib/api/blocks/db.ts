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

export const getDbBlocks = async (filter: { shortname?: string }) => {
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

export const getDbBlock = async (
  filter:
    | {
        author: string;
        name: string;
      }
    | { npmPackageName: string },
) => {
  const { db } = await connectToDatabase();

  const results = await db
    .collection(blocksDbCollectionName)
    .aggregate<ExpandedBlockMetadata>([
      { $match: filter },
      ...weeklyDownloadCountAggregationStage,
    ])
    .toArray();

  return results[0] ?? null;
};

export const insertDbBlock = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

  await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .insertOne(block);

  return block;
};

export const updateDbBlock = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

  const { author, name } = block;

  const { value: updatedBlock } = await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .findOneAndUpdate(
      { author, name },
      { $set: block },
      { returnDocument: "after", projection: defaultProjection },
    );

  return updatedBlock;
};
