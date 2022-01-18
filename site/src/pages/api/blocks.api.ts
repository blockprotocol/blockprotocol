import { NextApiHandler } from "next";
import { BlockMetadata } from "../../lib/blocks";
import { formatErrors } from "../../util/api";
import blocksData from "../../../blocks-data.json";

const validateApiKey = (apiKey: string | string[] | undefined) => {
  if (!apiKey || typeof apiKey !== "string") {
    return false;
  }
  // @todo add logic to validate API Key
  return true;
};

type Response = { results: BlockMetadata[] } | { errors: any };

const blocks: NextApiHandler<Response> = (_req, res) => {
  const query = _req.query.q;
  const apiKey = _req.headers["x-api-key"];

  if (!validateApiKey(apiKey)) {
    return res.status(401).json(
      formatErrors({
        msg: "Unauthorized",
      }),
    );
  }

  let data: BlockMetadata[] = [];

  // do we return data when the query string is empty?

  if (query && typeof query === "string") {
    data = blocksData.filter(
      ({ displayName, variants }) =>
        displayName?.toLowerCase().includes(query) ||
        variants?.some((variant) =>
          variant.displayName?.toLowerCase().includes(query),
        ),
    );
  }

  res.status(200).json({
    results: data,
  });
};

export default blocks;
