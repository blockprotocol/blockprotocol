import expressSession from "express-session";
import MongoStore from "connect-mongo";

// cookie maximum age (365 days)
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365;
const SESSION_SECRET = "asdf";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  dbName: MONGODB_DB_NAME,
  collectionName: "bp-site-sessions",
});

export const sessionMiddleware = expressSession({
  secret: SESSION_SECRET,
  store: sessionStore,
  cookie: {
    domain: process.env.FRONTEND_DOMAIN?.includes("blockprotocol.org")
      ? ".blockprotocol.org"
      : "localhost",
    maxAge: COOKIE_MAX_AGE_MS,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  name: "blockprotocol-session-id",
  resave: false,
  saveUninitialized: false,
});
