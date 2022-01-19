import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-connect";
import { Db } from "mongodb";
import { connectToDatabase } from "../mongodb";

export type DbRequestExtensions = {
  db: Db;
};

export const dbMiddleware: Middleware<
  NextApiRequest & DbRequestExtensions,
  NextApiResponse
> = async (req, _res, next) => {
  const { db } = await connectToDatabase();
  req.db = db;
  next();
};
