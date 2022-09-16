import axios from "axios";

import { mustGetEnvVar } from "../../../util/api";
import { ExpandedBlockMetadata } from "../../blocks";
import { isProduction } from "../../config";

export const notifySlackAboutBlock = async (
  block: ExpandedBlockMetadata,
  changeType: "publish" | "update",
) => {
  if (!isProduction) return;

  const webhookURL = mustGetEnvVar("SLACK_BLOCK_NOTIFICATION_WEBHOOK_URL");

  const body = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text:
            changeType === "publish" ? "New Block Published" : "Block Updated",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://blockprotocol.org${block.blockSitePath}|*Block Hub - ${block.displayName}*>\n${block.description}`,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Author: <https://blockprotocol.org/@${block.author}|@${block.author}>`,
          },
        ],
      },
      /**
       * @todo find why image block is not working with after publishing via CLI
       * slack api throws an error if it cannot render the image we provide, instead of not showing the image
       * we need to find a way to solve this, otherwise blocks with invalid images (e.g. .svg files, or url below)
       * does not notify the channel, since slack refuses to send the message with broken img url
       * example url we get when we publish local package from CLI:
       * https://blocks-dev.hashai.workers.dev/local-dev/yusuf-kinatas/yusufkniatas/yusuf-shuffleee/public/preview.png
       */
      // {
      //   type: "image",
      //   image_url: block.image,
      //   alt_text: "Block preview image",
      // },
    ] as Record<string, any>[],
  };

  return axios.post(webhookURL, body, {
    headers: { "Content-Type": "application/json" },
  });
};
