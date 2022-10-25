import _slugify from "slugify";

const slugify = _slugify as unknown as typeof _slugify.default;

export const generateSlug = (stringToSlugify: string) =>
  slugify(stringToSlugify, {
    lower: true,
    strict: true,
  });

export const createPathWithNamespace = (blockName: string, shortname: string) =>
  `@${shortname}/${blockName}`;
