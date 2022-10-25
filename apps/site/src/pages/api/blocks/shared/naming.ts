import rawSlugify from "slugify";

const slugify = rawSlugify as unknown as typeof rawSlugify.default;

export const generateSlug = (stringToSlugify: string) =>
  slugify(stringToSlugify, {
    lower: true,
    strict: true,
  });

export const createPathWithNamespace = (blockName: string, shortname: string) =>
  `@${shortname}/${blockName}`;
