import { Db } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { connectToDatabase } from "../mongodb";

export type DbRequestExtensions = {
  db: Db;
};

export const dbMiddleware = async (
  req: NextApiRequest & DbRequestExtensions,
  _res: NextApiResponse,
  next: NextHandler,
) => {
  const { db } = await connectToDatabase();
  req.db = db;
  return next();
};
