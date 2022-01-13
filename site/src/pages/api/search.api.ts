import { NextApiHandler } from "next";
import { formatErrors } from "../../util/api";
import { BlockMetadata, readBlocksFromDisk } from "./blocks.api";

const validateApiKey = (apiKey: string | null) => {
  if (!apiKey || typeof apiKey !== "string") {
    return false;
  }
  return true;
};

type Response = { results: BlockMetadata[] } | { errors: any };

const search: NextApiHandler<Response> = (_req, res) => {
  const blocks = readBlocksFromDisk();
  const query = _req.query.q;
  const apiKey = _req.headers["x-api-key"];
  let data: BlockMetadata[] = [];

  if (typeof apiKey === "string" && !validateApiKey(apiKey)) {
    return res.status(401).json(
      formatErrors({
        msg: "Unauthorized",
      }),
    );
  }

  if (query && typeof query === "string") {
    data = blocks.filter(({ displayName }) =>
      displayName?.toLowerCase().includes(query),
    );
  }

  res.status(200).json({
    results: data,
  });
};

export default search;

// const search2 = createBaseHandler<{}, Response>().get(async (req, res) => {
//   const blocks = readBlocksFromDisk();
//   const query = req.query.q;
//   let data: BlockMetadata[] = [];

//   if (!validateApiKey()) {
//     return res.status(401).json(
//       formatErrors({
//         msg: "Unauthorized",
//       }),
//     );
//   }

//   if (query && typeof query == "string") {
//     data = blocks.filter(({ displayName }) =>
//       displayName?.toLowerCase().includes(query),
//     );
//   }

//   res.status(200).json({
//     results: data,
//   });
// });

// export default search2;
