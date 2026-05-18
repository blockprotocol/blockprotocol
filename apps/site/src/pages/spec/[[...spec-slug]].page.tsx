import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { NextSeo } from "next-seo";
import { useContext } from "react";

import siteMap from "../../../site-map.json";
import { DocsContent } from "../../components/pages/docs/docs-content";
import { generatePathWithoutParams } from "../../components/shared";
import SiteMapContext from "../../context/site-map-context";
import {
  DOCS_VERSIONS,
  DocsVersion,
  isDocsVersion,
  LATEST_DOCS_VERSION,
} from "../../lib/docs-versions";
import { SiteMap, SiteMapPage } from "../../lib/sitemap";
import { findDeprecatedNoticeHref } from "../../util/deprecated-page";
import { getSerializedPageForVersion } from "../../util/mdx-utils";

const typedSiteMap = siteMap as SiteMap;

const specPagesByVersion = typedSiteMap.versionedSubPages.spec;

type SpecPageQueryParams = {
  "spec-slug"?: string[];
};

type SpecPageProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
  requestedVersion: DocsVersion;
  servedFromVersion: DocsVersion;
  /**
   * Set when the same logical slug exists at a newer version, and that
   * newer version marks the page as `hiddenFromSidebar` (i.e. the page has
   * been deprecated). The href points at the newest such version so the
   * user lands on whichever copy carries the explanatory notice.
   */
  deprecatedNoticeHref: string | null;
};

const flattenPages = (pages: SiteMapPage[]): SiteMapPage[] =>
  pages.flatMap((page) => [page, ...flattenPages(page.subPages ?? [])]);

export const getStaticPaths: GetStaticPaths<SpecPageQueryParams> = async () => {
  const paths = DOCS_VERSIONS.flatMap((version) => {
    const versionPages = specPagesByVersion[version] ?? [];
    const allHrefs = flattenPages(versionPages).map(({ href }) => href);
    const hrefSet = new Set(allHrefs);
    hrefSet.add(`/spec/${version}`);

    return Array.from(hrefSet).map((href) => ({
      params: {
        "spec-slug": href
          .replace(/^\/spec\//, "")
          .split("/")
          .filter((item) => !!item),
      },
    }));
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  SpecPageProps,
  SpecPageQueryParams
> = async ({ params }) => {
  const specSlug = (params || {})["spec-slug"] ?? [];

  const [maybeVersion, ...slugRest] = specSlug;

  if (!maybeVersion || !isDocsVersion(maybeVersion)) {
    return { notFound: true };
  }

  try {
    const { serializedPage, servedFromVersion } =
      await getSerializedPageForVersion({
        section: "spec",
        requestedVersion: maybeVersion,
        parts: slugRest.length ? slugRest : ["index"],
      });

    const pathname = `/spec/${maybeVersion}${
      slugRest.length ? `/${slugRest.join("/")}` : ""
    }`;
    const deprecatedNoticeHref = findDeprecatedNoticeHref({
      versionedSubPages: specPagesByVersion,
      section: "spec",
      requestedVersion: maybeVersion,
      pathname,
    });

    return {
      props: {
        serializedPage,
        requestedVersion: maybeVersion,
        servedFromVersion,
        deprecatedNoticeHref,
      },
    };
  } catch {
    return { notFound: true };
  }
};

const SpecPage: NextPage<SpecPageProps> = ({
  serializedPage,
  requestedVersion,
  deprecatedNoticeHref,
}) => {
  const { asPath } = useRouter();
  const { pages: allPages, versionedSubPages } = useContext(SiteMapContext);

  const pathWithoutParams = generatePathWithoutParams(asPath);

  const docsForVersion =
    versionedSubPages?.docs[requestedVersion] ??
    versionedSubPages?.docs[LATEST_DOCS_VERSION] ??
    [];

  const specForVersion =
    versionedSubPages?.spec[requestedVersion] ??
    versionedSubPages?.spec[LATEST_DOCS_VERSION] ??
    [];

  const roadmapPage = allPages
    .find(({ title }) => title === "Docs")
    ?.subPages?.find(({ title }) => title === "Roadmap");

  // The sidebar on `/spec` mirrors the sidebar on `/docs` so users can jump
  // between sibling sections without losing context. The `currentPage` match
  // below still highlights the active spec entry.
  const subPages = [
    ...docsForVersion,
    ...specForVersion,
    ...(roadmapPage ? [roadmapPage] : []),
  ];

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
        deprecatedNoticeHref={deprecatedNoticeHref ?? undefined}
      />
    </>
  );
};

export default SpecPage;
