import path from "node:path";

import fs from "fs-extra";
import { Db } from "mongodb";
import tar from "tar";
import tmp from "tmp-promise";

import { ExpandedBlockMetadata } from "../../blocks";
import { upsertBlockToDb } from "./db";
import {
  uploadOriginalTarballToS3,
  validateExpandAndUploadBlockFiles,
} from "./s3";

/**
 * Unpacks and uploads a tarball to remote storage
 * @param payload
 *  - createdAt: if this block was created previously, an ISO string of when it was created, otherwise null
 *  - pathWithNamespace: the block's unique path in the format '@[namespace]/[path]', e.g. '@hash/code'
 *  - tarballFilePath: the tarball containing the block's latest files
 */
const mirrorTarballToS3 = async ({
  createdAt,
  pathWithNamespace,
  tarballFilePath,
}: {
  createdAt: string | null;
  pathWithNamespace: string;
  tarballFilePath: string;
}): Promise<{
  expandedMetadata: ExpandedBlockMetadata;
}> => {
  const { path: extractionFolderPath, cleanup: cleanupExtractionFolder } =
    await tmp.dir({
      unsafeCleanup: true,
    });

  try {
    try {
      // we use a library because tar is not installed in Vercel lambdas
      await tar.x({
        cwd: extractionFolderPath,
        file: tarballFilePath,
      });
    } catch (err) {
      throw new Error("Could not extract tarball");
    }

    const { expandedMetadata } = await validateExpandAndUploadBlockFiles({
      createdAt,
      localFolderPath: extractionFolderPath,
      pathWithNamespace,
    });

    return { expandedMetadata };
  } finally {
    await cleanupExtractionFolder();
  }
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

  const { path: tarballFolder, cleanup: cleanupDistFolder } = await tmp.dir({
    unsafeCleanup: true,
  });

  try {
    const tarballFilePath = path.resolve(tarballFolder, "tarball.tar.gz");

    await fs.writeFile(tarballFilePath, tarball);

    const { expandedMetadata } = await mirrorTarballToS3({
      createdAt,
      pathWithNamespace,
      tarballFilePath,
    });

    await uploadOriginalTarballToS3({
      pathWithNamespace,
      version: expandedMetadata.version,
      tarballFilePath,
    });

    await upsertBlockToDb(expandedMetadata);

    return expandedMetadata;
  } finally {
    await cleanupDistFolder();
  }
};
