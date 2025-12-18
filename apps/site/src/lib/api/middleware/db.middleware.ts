import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { connectToDatabase } from "../mongodb";

export type DbRequestExtensions = {
  db: Db;
};

export const dbMiddleware = async (
  req: NextApiRequest,
  _res: NextApiResponse,
  next: NextHandler,
) => {
  const { db } = await connectToDatabase();
  (req as NextApiRequest & DbRequestExtensions).db = db;
  return next();
};
