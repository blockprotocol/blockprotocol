import { NextApiHandler } from "next";

import { getBlockByUserAndName } from "../../../lib/api/blocks/get";

const handler: NextApiHandler = async (req, res) => {
  if (req.url?.startsWith("/api/rewrites/")) {
    res.status(404).send("Not found");
    return;
  }

  const shortname = (req.query.shortname as string).replace(/^@/, "");

  const blockMetadata = await getBlockByUserAndName({
    shortname,
    name: req.query.blockslug as string,
  });

  if (!blockMetadata) {
    res.status(404);
    res.write("Block not found");
    res.end();
    return;
  }

  return res.json(blockMetadata);
};

export default handler;
