import { webpack } from "webpack";
import { cleanDist } from "../shared/clean-dist";

console.log("dev script");

const script = async () => {
  await cleanDist();

  await Promise.any([webpack({})]);
};

await script();
