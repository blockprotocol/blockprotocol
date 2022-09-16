import fs from "node:fs";

const graphServiceJsonString = fs
  .readFileSync("./graph-service.json")
  .toString();

const graphServiceJson = JSON.parse(graphServiceJsonString);

export { graphServiceJson };
