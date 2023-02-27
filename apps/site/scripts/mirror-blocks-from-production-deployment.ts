import axios from "axios";
import chalk from "chalk";

import { publishBlockFromTarball } from "../src/lib/api/blocks/from-tarball";
import { connectToDatabase } from "../src/lib/api/mongodb";

const blockTarballUrls = [
  // "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/code/0.2.0.tar.gz",
  "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/paragraph/0.1.1.tar.gz",
  "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/timer/0.2.0.tar.gz",
];

const script = async () => {
  console.log(chalk.bold("Mirroring blocks from production deployment..."));

  const { client, db } = await connectToDatabase();

  for (const blockTarballUrl of blockTarballUrls) {
    process.stdout.write(`Mirroring ${blockTarballUrl}...`);

    const response = await axios(blockTarballUrl, {
      responseType: "arraybuffer",
    });

    await publishBlockFromTarball(db, {
      createdAt: null,
      pathWithNamespace: blockTarballUrl
        .match(/\/block-uploads(\/[^/]+\/[^/]+)\//)![1]!
        .replace("/", "@"),
      tarball: Buffer.from(response.data, "binary"),
    });

    process.stdout.write(` Done.\n`);
  }

  await client.close();
  console.log(`✅ Number of blocks mirrored: ${blockTarballUrls.length}`);
};

await script();
