import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";

const Block: NextPage = () => {
  const router = useRouter();

  return <pre>{JSON.stringify(router, null, 2)}</pre>;
};

export default Block;
