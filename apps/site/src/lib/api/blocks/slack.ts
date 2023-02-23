import axios from "axios";

import { ExpandedBlockMetadata } from "../../blocks";

export const notifySlackAboutBlock = async (
  block: ExpandedBlockMetadata,
  changeType: "publish" | "update",
) => {
  const webhookUrl = process.env.SLACK_BLOCK_NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

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
    ] as Record<string, any>[],
  };

  if (block.image && !block.image.endsWith(".svg")) {
    body.blocks.push({
      type: "image",
      image_url: block.image,
      alt_text: "Block preview image",
    });
  }

  return axios.post(webhookUrl, body, {
    headers: { "Content-Type": "application/json" },
  });
};
