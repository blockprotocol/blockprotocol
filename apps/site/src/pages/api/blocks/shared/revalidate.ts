import { NextApiResponse } from "next";

export const revalidateMultiBlockPages = async (
  res: NextApiResponse,
  username: string,
) => {
  await res.revalidate("/");
  await res.revalidate("/hub");
  await res.revalidate(`/@${username}`);
};
