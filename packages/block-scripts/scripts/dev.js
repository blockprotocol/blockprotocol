// import { cleanDist } from "../shared/clean-dist.js";
import { serveDist } from "../shared/serve-dist.js";

const script = async () => {
  // await cleanDist();

  serveDist(9090);
  // await Promise.any([webpack({})]);
};

await script();
