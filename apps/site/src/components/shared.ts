import { useRouter } from "next/router.js";
import { useEffect, useState } from "react";

export const generatePathWithoutParams = (path: string) => {
  const pathWithoutParams = path.match(/^[^?]*/)?.[0];
  if (!pathWithoutParams) {
    throw new Error(`Invalid path ${path}`);
  }
  return pathWithoutParams;
};

/**
 * @see https://github.com/vercel/next.js/issues/25202
 */
export const useHydrationFriendlyAsPath = () => {
  const { asPath } = useRouter();
  const [ssr, setSsr] = useState(true);

  useEffect(() => {
    setSsr(false);
  }, []);

  return ssr ? asPath.split("#", 1)[0]! : asPath;
};
