import { serveDist } from "../shared/serve-dist.js";

const script = async () => {
  await serveDist();
};

await script();
