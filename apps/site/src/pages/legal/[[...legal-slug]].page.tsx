import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { LegalContent } from "../../components/pages/legal/legal-content";
import { generatePathWithoutParams } from "../../components/shared";
import SiteMapContext from "../../context/site-map-context";
import { SiteMap } from "../../lib/sitemap";
import { getSerializedPage } from "../../util/mdx-utils";

const documentationPages =
  (siteMap as SiteMap).pages.find(({ title }) => title === "Legal")!.subPages ??
  [];

type LegalPageQueryParams = {
  "legal-slug"?: string[];
};

type LegalPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticPaths: GetStaticPaths<
  LegalPageQueryParams
> = async () => {
  const possibleHrefs = documentationPages
    .flatMap((page) => [page, ...(page.subPages ?? [])])
    .map(({ href }) => href);

  const paths = possibleHrefs.map((href) => ({
    params: {
      "legal-slug": href
        .replace("/legal", "")
        .split("/")
        .filter((item) => !!item),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  LegalPageProps,
  LegalPageQueryParams
> = async ({ params }) => {
  const legalSlug = (params || {})["legal-slug"];

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/legal/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
    const serializedPage = await getSerializedPage({
      pathToDirectory: "legal",
      parts: legalSlug && legalSlug.length ? legalSlug : ["index"],
    });

    return {
      props: {
        serializedPage,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

const LegalPage: NextPage<LegalPageProps> = ({ serializedPage }) => {
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const pathWithoutParams = generatePathWithoutParams(asPath);

  const { subPages = [] } = allPages.find(({ title }) => title === "Legal")!;

  const flatSubPages = subPages.flatMap((page) => [
    page,
    ...(page.subPages ?? []),
  ]);

  const currentPage = flatSubPages.find(
    ({ href }) =>
      pathWithoutParams === href || pathWithoutParams?.startsWith(`${href}#`),
  );

  return (
    <LegalContent
      content={serializedPage}
      pages={subPages}
      currentPage={currentPage}
    />
  );
};

export default LegalPage;
