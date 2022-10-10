import { NextApiResponse } from "next";

export const revalidateBlockPages = async (
  res: NextApiResponse,
  username: string,
  blockName: string,
) => {
  await res.revalidate("/");
  await res.revalidate("/hub");
  await res.revalidate(`/@${username}`);
  await res.revalidate(`/@${username}/${blockName}`);
};
