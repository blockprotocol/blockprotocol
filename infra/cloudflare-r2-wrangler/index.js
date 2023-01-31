import * as Realm from "realm-web";

let App;

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

            await blockDownloads.insertOne({
              author: block.author,
              name: block.name,
              blockId: block._id,
              source: url.toString(),
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
