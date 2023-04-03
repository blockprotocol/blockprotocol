import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { NextSeo } from "next-seo";
import { useContext } from "react";

import { DocsContent } from "../components/pages/docs/docs-content";
import { generatePathWithoutParams } from "../components/shared";
import SiteMapContext from "../context/site-map-context";
import { getSerializedPage } from "../util/mdx-utils";

type RoadmapPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const getStaticProps: GetStaticProps<RoadmapPageProps> = async () => {
  const serializedPage = await getSerializedPage({
    pathToDirectory: "roadmap",
    parts: ["index"],
  });

  return {
    props: {
      serializedPage,
    },
  };
};

const RoadmapPage: NextPage<RoadmapPageProps> = ({ serializedPage }) => {
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
      <NextSeo title="Block Protocol – Roadmap" />
      <DocsContent
        content={serializedPage}
        pages={subPages}
        flatPages={flatSubPages}
        currentPage={currentPage}
      />
    </>
  );
};

export default RoadmapPage;
