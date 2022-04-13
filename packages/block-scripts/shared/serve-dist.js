import handler from "serve-handler";
import http from "node:http";

export const serveDist = (port = 3000) => {
  const server = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return handler(request, response, {
      public: "dist",
    });
  });

  server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
  });
};
