import $RefParser from "@apidevtools/json-schema-ref-parser";

const loadSubSchema = async ({ url }: { url: string }) => {
  return fetch(url, { headers: { accept: "application/json" } }).then((resp) =>
    resp.json(),
  );
};

export const fetchSchema = async (schemaUri: string) => {
  const rootSchema = await loadSubSchema({
    url: schemaUri,
  });

  const compiledSchema = await $RefParser.dereference(rootSchema, {
    resolve: { http: { read: loadSubSchema } },
  });

  return compiledSchema;
};
