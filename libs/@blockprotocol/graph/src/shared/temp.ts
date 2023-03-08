import { codegen } from "../codegen";

(async () => {
  await codegen(
    {
      targetRoot: "src/generated",
      targets: {
        "address-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/address-block/v/2",
            blockEntity: true,
          },
        ],
        "ai-image-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/ai-image-block/v/2",
            blockEntity: true,
          },
        ],
        "ai-text-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/ai-text-block/v/2",
            blockEntity: true,
          },
        ],
        "callout-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/callout-block/v/2",
            blockEntity: true,
          },
        ],
        "code-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/code-block/v/2",
            blockEntity: true,
          },
        ],
        "countdown-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/countdown-block/v/2",
            blockEntity: true,
          },
        ],
        "divider-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/divider-block/v/2",
            blockEntity: true,
          },
        ],
        "image-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/image-block/v/2",
            blockEntity: true,
          },
        ],
        "how-to-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/how-to-block/v/2",
            blockEntity: true,
          },
        ],
        "shuffle-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/shuffle-block/v/2",
            blockEntity: true,
          },
        ],
        "timer-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/timer-block/v/2",
            blockEntity: true,
          },
        ],
        "video-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/video-block/v/2",
            blockEntity: true,
          },
        ],
        "stopwatch-block.ts": [
          {
            versionedUrl:
              "https://blockprotocol.org/@hash/types/entity-type/stopwatch-block/v/2",
            blockEntity: true,
          },
        ],
        "person.ts": [
          {
            versionedUrl:
              "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3",
          },
        ],
        "organization.ts": [
          {
            versionedUrl:
              "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2",
          },
        ],
      },
      typeNameOverrides: {
        "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3":
          "MyNewPerson",
        "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/2":
          "MyOldPerson",
      },
    },
    "trace",
  );
})();
