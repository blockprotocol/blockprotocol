import path from "node:path";

import fs from "fs-extra";
import { Db } from "mongodb";
import tar from "tar";
import tmp from "tmp-promise";

import { ExpandedBlockMetadata } from "../../blocks.js";
import { insertDbBlock, updateDbBlock } from "./db.js";
import { validateExpandAndUploadBlockFiles } from "./s3.js";

/**
 * Unpacks and uploads a tarball to remote storage
 * @param payload
 *  - createdAt: if this block was created previously, an ISO string of when it was created, otherwise null
 *  - pathWithNamespace: the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 *  - tarball: the tarball containing the block's latest files
 */
const mirrorTarballToS3 = async ({
  createdAt,
  pathWithNamespace,
  tarball,
}: {
  createdAt: string | null;
  pathWithNamespace: string;
  tarball: Buffer;
}): Promise<{
  expandedMetadata: ExpandedBlockMetadata;
}> => {
  const { path: tarballFolder, cleanup: cleanupDistFolder } = await tmp.dir({
    unsafeCleanup: true,
  });

  const tarballPath = path.resolve(tarballFolder, "tarball.tar.gz");

  await fs.writeFile(tarballPath, tarball);

  const extractionFolderPath = path.resolve(tarballFolder, "package");
  await fs.ensureDir(extractionFolderPath);

  try {
    // we use a library because tar is not installed in Vercel lambdas
    await tar.x({
      cwd: extractionFolderPath,
      file: tarballPath,
    });
  } catch (err) {
    throw new Error("Could not extract tarball");
  }

  const { expandedMetadata } = await validateExpandAndUploadBlockFiles({
    createdAt,
    localFolderPath: extractionFolderPath,
    pathWithNamespace,
  });

  await cleanupDistFolder();

  return { expandedMetadata };
};

/**
 * Publishes a block using a tarball containing its source files
 * @param db a database client
 * @param params.createdAt åif this block was created previously, an ISO string of when it was created, otherwise null
 * @param params.pathWithNamespace the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 * @param params.tarball the tarball containing the block's latest files
 */
export const publishBlockFromTarball = async (
  db: Db,
  params: {
    createdAt: string | null;
    pathWithNamespace: string;
    tarball: Buffer;
  },
) => {
  const { createdAt, pathWithNamespace, tarball } = params;

  const { expandedMetadata } = await mirrorTarballToS3({
    createdAt,
    pathWithNamespace,
    tarball,
  });

  await (createdAt
    ? updateDbBlock(expandedMetadata)
    : insertDbBlock(expandedMetadata));

  return expandedMetadata;
};
