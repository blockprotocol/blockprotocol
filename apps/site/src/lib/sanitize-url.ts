import sanitize from "sanitize-html";

export const sanitizeUrl = (url: string) => {
  const results = sanitize(`<a href="${url}" />`, {
    allowedAttributes: {
      a: ["href"],
    },
    allowedSchemes: ["http", "https"],
  });
  return results.split('"')?.[1] || "";
};
