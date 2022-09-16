// eslint-disable-next-line unicorn/prefer-node-protocol,no-restricted-imports -- https://github.com/vercel/next.js/issues/28774
import fs from "fs";

const graphServiceJsonString = fs
  .readFileSync("./graph-service.json")
  .toString();

const graphServiceJson = JSON.parse(graphServiceJsonString);

export { graphServiceJson };
