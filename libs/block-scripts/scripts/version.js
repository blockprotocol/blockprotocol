import { getBlockScriptsVersion } from "../shared/config.js";

const script = async () => {
  console.log(await getBlockScriptsVersion());
};

await script();
