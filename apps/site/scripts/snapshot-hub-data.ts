import path from "node:path";

import chalk from "chalk";
import fs from "fs-extra";

import type { ExpandedBlockMetadata } from "../src/lib/blocks";

const PRODUCTION_ORIGIN = "https://blockprotocol.org";

// Shortnames whose blocks we want to mirror into the snapshot.
// Discovered by scraping `${PRODUCTION_ORIGIN}/hub` once - any new author
// (or new author whose blocks should remain listed) should be added here.
//
// Authors deliberately excluded:
//   - prachi123 (single low-quality "block-proto-practice" placeholder block)
const SHORTNAMES = [
  "alfie",
  "blockprotocol",
  "hash",
  "jerlendds",
  "rikhen",
  "tldraw",
] as const;

export type SnapshotUser = {
  shortname: string;
  preferredName: string;
  userAvatarUrl?: string;
};

export type HubSnapshot = {
  generatedAt: string;
  source: string;
  users: SnapshotUser[];
  blocks: ExpandedBlockMetadata[];
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
};

const script = async () => {
  console.log(
    chalk.bold(`Snapshotting Hub data from ${PRODUCTION_ORIGIN}...`),
  );

  const users: SnapshotUser[] = [];
  const blocks: ExpandedBlockMetadata[] = [];

  for (const shortname of SHORTNAMES) {
    process.stdout.write(`  @${shortname}`);

    const { user } = await fetchJson<{
      user: {
        shortname: string;
        preferredName?: string;
        userAvatarUrl?: string;
      };
    }>(`${PRODUCTION_ORIGIN}/api/users/${shortname}`);

    users.push({
      shortname: user.shortname,
      preferredName: user.preferredName ?? user.shortname,
      userAvatarUrl: user.userAvatarUrl,
    });

    const { blocks: userBlocks } = await fetchJson<{
      blocks: ExpandedBlockMetadata[];
    }>(`${PRODUCTION_ORIGIN}/api/users/${shortname}/blocks`);

    blocks.push(...userBlocks);
    process.stdout.write(` → ${userBlocks.length} block(s)\n`);
  }

  blocks.sort((a, b) =>
    a.pathWithNamespace.localeCompare(b.pathWithNamespace),
  );
  users.sort((a, b) => a.shortname.localeCompare(b.shortname));

  const snapshot: HubSnapshot = {
    generatedAt: new Date().toISOString(),
    source: PRODUCTION_ORIGIN,
    users,
    blocks,
  };

  const snapshotFilePath = path.join(process.cwd(), "hub-snapshot.json");
  await fs.writeJson(snapshotFilePath, snapshot, { spaces: 2 });

  console.log(
    chalk.green(
      `✅ Snapshot written to ${snapshotFilePath} (${blocks.length} blocks, ${users.length} users)`,
    ),
  );
};

await script();
