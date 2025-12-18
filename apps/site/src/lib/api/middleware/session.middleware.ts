import MongoStore from "connect-mongo";
import signature from "cookie-signature";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import nextSession from "next-session";
import { promisifyStore } from "next-session/lib/compat";

import { mustGetEnvVar } from "../../../util/api";
import { isProduction, isUsingHttps } from "../../config";
import { SESSION_COOKIE_NAME } from "./constants";

// cookie maximum age (365 days)
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;
const SESSION_SECRET = mustGetEnvVar("SESSION_SECRET");
const MONGODB_URI = mustGetEnvVar("MONGODB_URI");
const MONGODB_DB_NAME = mustGetEnvVar("MONGODB_DB_NAME");

const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  dbName: MONGODB_DB_NAME,
  collectionName: "bp-site-sessions",
});

const getSession = nextSession({
  store: promisifyStore(sessionStore),
  cookie: {
    domain: isProduction
      ? "blockprotocol.org"
      : process.env.VERCEL
      ? ".stage.hash.ai"
      : "localhost",
    maxAge: COOKIE_MAX_AGE_SEC,
    httpOnly: true,
    sameSite: "lax",
    secure: isUsingHttps,
  },
  name: SESSION_COOKIE_NAME,
  decode: (raw) => signature.unsign(raw.slice(2), SESSION_SECRET) || null,
  encode: (sid) => (sid ? `s:${signature.sign(sid, SESSION_SECRET)}` : ""),
});

export const sessionMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  await getSession(req, res); // session is set to req.session
  return next();
};
