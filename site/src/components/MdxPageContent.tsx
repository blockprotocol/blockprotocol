import { useEffect, useState, VFC } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useRouter } from "next/router";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Box, { BoxProps } from "@mui/material/Box";
import { mdxComponents } from "../util/mdxComponents";
import PageHeadingsContext, { Heading } from "./context/PageHeadingsContext";

export const MDX_TEXT_CONTENT_MAX_WIDTH = 680;

type MdxPageContentProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
} & BoxProps;

let detectHeadingFromScrollTimer: NodeJS.Timeout | undefined = undefined;

export const MdxPageContent: VFC<MdxPageContentProps> = ({
  serializedPage,
  ...boxProps
}) => {
  const router = useRouter();

  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    setHeadings([]);
  }, [serializedPage]);

  const [currentHeading, setCurrentHeading] = useState<Heading>();
  const [detectHeadingFromScroll, setDetectHeadingFromScroll] =
    useState<boolean>(true);

  const [anchor, setAnchor] = useState<string>(
    router.asPath.split("#")[1] ?? "",
  );

  useEffect(() => {
    setAnchor(router.asPath.split("#")[1] ?? "");
  }, [router]);

  useEffect(() => {
    const headingWithCurrentAnchor = headings.find(
      (heading) => heading.anchor === anchor,
    );

    if (headingWithCurrentAnchor) {
      if (
        !currentHeading ||
        headingWithCurrentAnchor.anchor !== currentHeading.anchor
      ) {
        setCurrentHeading(headingWithCurrentAnchor);
        setDetectHeadingFromScroll(false);

        window.scrollTo({
          top: headingWithCurrentAnchor.element.offsetTop - 100,
          behavior: "smooth",
        });

        if (detectHeadingFromScrollTimer) {
          clearTimeout(detectHeadingFromScrollTimer);
        }
        detectHeadingFromScrollTimer = setTimeout(
          () => setDetectHeadingFromScroll(true),
          1500,
        );
      }
    }
  }, [anchor, headings, currentHeading]);

  useEffect(() => {
    const onScroll = () => {
      if (!detectHeadingFromScroll) return;

      let headingAtScrollPosition: Heading = headings[0];

      for (const heading of headings.slice(1)) {
        const { element } = heading;

        const { top } = element.getBoundingClientRect();
        if (
          top < 150 &&
          headingAtScrollPosition.element.getBoundingClientRect().top < top
        ) {
          headingAtScrollPosition = heading;
        }
      }

      const { asPath } = router;

      if (
        headingAtScrollPosition.anchor
          ? !asPath.endsWith(`#${headingAtScrollPosition.anchor}`)
          : asPath !== asPath.split("#")[0]
      ) {
        unstable_batchedUpdates(() => {
          setCurrentHeading(headingAtScrollPosition);
          setAnchor(headingAtScrollPosition.anchor);
        });
        void router.replace(
          `${asPath.split("#")[0]}${
            headingAtScrollPosition.anchor
              ? `#${headingAtScrollPosition.anchor}`
              : ""
          }`,
        );
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [router, headings, detectHeadingFromScroll]);

  return (
    <PageHeadingsContext.Provider
      value={{
        headings,
        setHeadings,
      }}
    >
      <Box
        {...boxProps}
        sx={{
          width: "100%",
          overflow: "auto",
          "& > :not(.info-card-wrapper), > a:not(.info-card-wrapper) > *": {
            maxWidth: {
              xs: "100%",
              sm: MDX_TEXT_CONTENT_MAX_WIDTH,
            },
          },
        }}
      >
        <MDXRemote {...serializedPage} components={mdxComponents} />
      </Box>
    </PageHeadingsContext.Provider>
  );
};
