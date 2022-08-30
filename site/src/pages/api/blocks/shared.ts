import { NextApiResponse } from "next";
import slugify from "slugify";

export const revalidateMultiBlockPages = async (
  res: NextApiResponse,
  username: string,
) => {
  await res.revalidate("/");
  await res.revalidate("/hub");
  await res.revalidate(`/@${username}`);
};

export const generateSlug = (stringToSlugify: string) =>
  slugify(stringToSlugify, {
    lower: true,
    strict: true,
  });

export const createPathWithNamespace = (blockName: string, shortname: string) =>
  `@${shortname}/${blockName}`;
