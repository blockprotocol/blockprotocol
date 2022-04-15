import { getBlockScriptsVersion } from "../shared/config.mjs";

const script = async () => {
  console.log(await getBlockScriptsVersion());
};

await script();
