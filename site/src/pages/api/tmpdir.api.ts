import { NextApiHandler } from "next";
import os from "node:os";

const handler: NextApiHandler = async (req, res) => {
  res.write(os.tmpdir());
  res.end();
};

export default handler;
