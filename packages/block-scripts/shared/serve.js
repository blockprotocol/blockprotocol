import handler from "serve-handler";
import http from "node:http";
import {
  extractScriptConfig,
  extractBlockScriptsConfigFromPackageJson,
} from "./config.js";

export const serve = async () => {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: "dist",
    });
  });

  const servePort =
    Number.parseInt(extractScriptConfig().listen, 10) ||
    Number.parseInt(
      (await extractBlockScriptsConfigFromPackageJson()).servePort,
      10,
    ) ||
    9090;

  server.listen(servePort, () => {
    console.log(`Serving block's dist folder http://localhost:${servePort}`);
  });
};
