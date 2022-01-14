import expressSession from "express-session";
import MongoStore from "connect-mongo";
import { mustGetEnvVar } from "../../util/api";
import { FRONTEND_DOMAIN, USE_HTTPS } from "../config";

// cookie maximum age (365 days)
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365;
const SESSION_SECRET = mustGetEnvVar("SESSION_SECRET");
const MONGODB_URI = mustGetEnvVar("MONGODB_URI");
const MONGODB_DB_NAME = mustGetEnvVar("MONGODB_DB_NAME");

const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  dbName: MONGODB_DB_NAME,
  collectionName: "bp-site-sessions",
});

export const sessionMiddleware = expressSession({
  secret: SESSION_SECRET,
  store: sessionStore,
  cookie: {
    domain: FRONTEND_DOMAIN.startsWith("localhost")
      ? "localhost"
      : `.${FRONTEND_DOMAIN}`,
    maxAge: COOKIE_MAX_AGE_MS,
    httpOnly: true,
    sameSite: "lax",
    secure: USE_HTTPS,
  },
  name: "blockprotocol-session-id",
  resave: false,
  saveUninitialized: false,
});
