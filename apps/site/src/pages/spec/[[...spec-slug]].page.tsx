import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { NextSeo } from "next-seo";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { DocsContent } from "../../components/pages/docs/docs-content";
import { generatePathWithoutParams } from "../../components/shared";
import SiteMapContext from "../../context/site-map-context";
import { SiteMap } from "../../lib/sitemap";
import { getSerializedPage } from "../../util/mdx-utils";

const documentationPages =
  (siteMap as SiteMap).pages
    .find(({ title }) => title === "Docs")!
    .subPages?.find(({ title }) => title === "Specification")!.subPages ?? [];

type SpecPageQueryParams = {
  "spec-slug"?: string[];
};

type SpecPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticPaths: GetStaticPaths<SpecPageQueryParams> = async () => {
  const possibleHrefs = documentationPages
    .flatMap((page) => [page, ...(page.subPages ?? [])])
    .map(({ href }) => href)
    .concat("/spec");

  const paths = possibleHrefs.map((href) => ({
    params: {
      "spec-slug": href
        .replace("/spec", "")
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
  SpecPageProps,
  SpecPageQueryParams
> = async ({ params }) => {
  const specSlug = (params || {})["spec-slug"];

  // As of Jan 2022, { fallback: false } in getStaticPaths does not prevent Vercel
  // from calling getStaticProps for unknown pages. This causes 500 instead of 404:
  //
  //   Error: ENOENT: no such file or directory, open '{...}/_pages/spec/undefined'
  //
  // Using try / catch prevents 500, but we might not need them in Next v12+.
  try {
    const serializedPage = await getSerializedPage({
      pathToDirectory: "spec",
      parts: specSlug && specSlug.length ? specSlug : ["index"],
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

const SpecPage: NextPage<SpecPageProps> = ({ serializedPage }) => {
  const { asPath } = useRouter();
  const { pages: allPages } = useContext(SiteMapContext);

  const pathWithoutParams = generatePathWithoutParams(asPath);

  const { subPages = [] } = allPages.find(({ title }) => title === "Docs")!;

  const flatSubPages = subPages.flatMap((page) => [
    page,
    ...(page.subPages ?? []),
  ]);

  const currentPage = flatSubPages.find(
    ({ href }) =>
      pathWithoutParams === href || pathWithoutParams?.startsWith(`${href}#`),
  );

  return (
    <>
      <NextSeo title="Block Protocol – Specification" />
      <DocsContent
        content={serializedPage}
        pages={subPages}
        flatPages={flatSubPages}
        currentPage={currentPage}
      />
    </>
  );
};

export default SpecPage;
