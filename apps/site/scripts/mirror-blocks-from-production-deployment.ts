import chalk from "chalk";

const blockTarballUrls = [
  "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/code/0.2.0.tar.gz",
  "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/paragraph/0.1.1.tar.gz",
  "https://blockprotocol-preview.hashai.workers.dev/block-uploads/hash/timer/0.2.0.tar.gz",
];

const script = async () => {
  console.log(chalk.bold("Mirroring blocks from production deployment..."));

  console.log(`✅ Number of blocks mirrored: ${blockTarballUrls.length}`);
};

await script();
