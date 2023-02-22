import http from "node:http";

import handler from "serve-handler";

import { getPort } from "../shared/config.js";

const script = async () => {
  const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*"); // cors
    response.setHeader("Cache-Control", "no-store");
    return handler(request, response, {
      public: "dist",
    });
  });

  const port = await getPort("production");

  server.listen(port, () => {
    console.log(`Serving block's dist folder http://localhost:${port}`);
  });
};

await script();
