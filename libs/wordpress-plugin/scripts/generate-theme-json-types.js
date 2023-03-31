const { compile } = require("json-schema-to-typescript");
const { writeFileSync } = require("node:fs");

(async () => {
  const themeJson = await fetch("https://schemas.wp.org/trunk/theme.json").then(
    (res) => res.json(),
  );

  console.log({ themeJson });

  const themeJsonTypes = await compile(themeJson, "ThemeJson");

  writeFileSync("theme-json.ts", themeJsonTypes);
})();
