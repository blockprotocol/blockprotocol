import slugify from "slugify";

export const generateSlug = (stringToSlugify: string) =>
  slugify(stringToSlugify, {
    lower: true,
    strict: true,
  });

export const createPathWithNamespace = (blockName: string, shortname: string) =>
  `@${shortname}/${blockName}`;
