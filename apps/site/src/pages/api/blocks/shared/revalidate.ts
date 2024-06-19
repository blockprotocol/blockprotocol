import { captureException } from "@sentry/nextjs";
import { NextApiResponse } from "next";

export const revalidateBlockPages = async (
  res: NextApiResponse,
  username: string,
  blockName: string,
) => {
  // Capture exceptions to warn us if a page is no longer statically generated but still appears here
  await res.revalidate("/").catch(() => {
    captureException(
      "Failed to revalidate path '/' - does it still have static props?",
    );
  });
  await res.revalidate(`/@${username}`).catch(() => {
    captureException(
      "Failed to revalidate path '/@[shortname]' - does it still have static props?",
    );
  });
  await res.revalidate(`/@${username}/blocks/${blockName}`).catch(() => {
    captureException(
      "Failed to revalidate path '/@[shortname]/blocks/[block]' - does it still have static props?",
    );
  });
};
