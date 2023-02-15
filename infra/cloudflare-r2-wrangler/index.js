import * as Realm from "realm-web";

let App;

/**
 * @param {string} context.origin - used as the Anonymous ID for data sending
 */
const createDownloadReport = (context) => ({
  anonymousId: context.origin,
  event: "block_download",
  properties: {
    ...context,
  },
});

const sendReport = async (env, reportArgs) => {
  const dataUrl = env.DATA_URL;
  const dataWriteKey = env.DATA_WRITE_KEY;
  if (dataUrl && dataWriteKey) {
    const data = createDownloadReport(reportArgs);

    // `btoa` is supplied in the worker global scope
    // set the write key as the username and leave the password blank using
    // HTTP basic authentication.
    const authHeader = `Basic ${btoa(dataWriteKey + ":")}`;
    const _response = await fetch(dataUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error(
        `Error sending report [report=${JSON.stringify(
          reportArgs,
        )},error="${error}"]`,
      );
    });
  }
};

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (request.method === "GET") {
      const object = await env.BLOCKPROTOCOL_BUCKET.get(key); // variable named defined in wrangler.toml

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      const requestContext = {
        ip: request.headers.get("CF-Connecting-IP"),
        origin: request.headers.get("Origin"),
        userAgent: request.headers.get("User-Agent"),
        city: request.cf.city,
        region: request.cf.region,
      };

      // Non-blocking function to register a download when a block's source requested
      context.waitUntil(
        (async () => {
          try {
            // @see https://www.mongodb.com/developer/products/atlas/cloudflare-worker-rest-api/
            App = App || new Realm.App(env.MONGO_APP_SERVICE_ID);
            const credentials = Realm.Credentials.apiKey(
              env.MONGO_APP_SERVICE_API_KEY,
            );
            const user = await App.logIn(credentials);
            const client = user.mongoClient("mongodb-atlas");

            const blocks = client.db(env.MONGO_DB_NAME).collection("bp-blocks");

            const stringifiedUrl = url.toString();

            // @todo update when multiple block versions are maintained in db
            const block = await blocks.findOne({ source: stringifiedUrl });

            if (!block) {
              // this isn't a source entry point
              return;
            }

            const blockDownloads = client
              .db(env.MONGO_DB_NAME)
              .collection("bp-block-downloads");

            await sendReport(env, {
              origin: requestContext.origin,
              author: block.author,
              name: block.name,
              blockId: block._id,
              source: stringifiedUrl,
              workerTimestamp: new Date().toISOString(),
            });

            await blockDownloads.insertOne({
              author: block.author,
              name: block.name,
              blockId: block._id,
              source: stringifiedUrl,
              downloadedAt: new Date().toISOString(),
              context: requestContext,
            });
          } catch (err) {
            console.error(`Error counting block download: ${err}`);
          }
        })(),
      );

      return new Response(object.body, {
        headers,
      });
    }

    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET",
      },
    });
  },
};
