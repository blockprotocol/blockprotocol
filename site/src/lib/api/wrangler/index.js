export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (request.method === "GET") {
      const object = await env.BLOCK_BUCKET.get(key); // variable named defined in wrangler.toml

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

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
