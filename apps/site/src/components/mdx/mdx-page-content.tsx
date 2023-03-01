import Box, { BoxProps } from "@mui/material/Box";
import throttle from "lodash/throttle";
import { useRouter } from "next/router";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import PageHeadingsContext, { Heading } from "../context/page-headings-context";
import { mdxComponents } from "./mdx-components";

export const MDX_TEXT_CONTENT_MAX_WIDTH = 680;

type MdxPageContentProps = {
  serializedPage: MDXRemoteSerializeResult<Record<string, unknown>>;
} & BoxProps;

let detectHeadingFromScrollTimer: NodeJS.Timeout | undefined = undefined;

export const MdxPageContent: FunctionComponent<MdxPageContentProps> = ({
  serializedPage,
  ...boxProps
}) => {
  const router = useRouter();

  const [headings, setHeadings] = useState<Heading[]>([]);

  const detectHeadingFromScroll = useRef<boolean>(true);

  const currentHeading = useRef<Heading | undefined>(undefined);

  const headingsRef = useRef<Heading[]>([]);

  useEffect(() => {
    setHeadings([]);

    return () => {
      currentHeading.current = undefined;
      setHeadings([]);
    };
  }, [serializedPage]);

  const scrolledOnce = useRef(false);

  useEffect(() => {
    if (headings.length) {
      const anchor = router.asPath.match(/(?:#)(.*?)(?:\?|$)/)?.[1] ?? "";

      const headingWithCurrentAnchor = headings.find(
        (heading) => heading.anchor === anchor,
      );

      const previousRoute = sessionStorage.getItem("previousRoute");

      const shouldScrollToAnchor =
        // if anchor is empty and we haven't scrolled, prevent it
        (anchor === "" && scrolledOnce.current) ||
        // if anchor is not empty, always allow scroll
        anchor !== "" ||
        // OR if previous path is either a docs or spec page
        (previousRoute?.includes("/docs") && router.asPath?.includes("/docs"));

      if (!scrolledOnce.current) {
        scrolledOnce.current = true;
      }

      if (anchor === "" && shouldScrollToAnchor) {
        currentHeading.current = headings[0]!;
        detectHeadingFromScroll.current = false;

        window.scrollTo({
          top: 0,
        });

        if (detectHeadingFromScrollTimer) {
          clearTimeout(detectHeadingFromScrollTimer);
        }
        detectHeadingFromScrollTimer = setTimeout(() => {
          detectHeadingFromScroll.current = true;
        }, 1500);
      } else if (
        headingWithCurrentAnchor &&
        shouldScrollToAnchor &&
        (!currentHeading.current ||
          headingWithCurrentAnchor.element !==
            currentHeading.current.element) &&
        document.body.contains(headingWithCurrentAnchor.element)
      ) {
        currentHeading.current = headingWithCurrentAnchor;
        detectHeadingFromScroll.current = false;

        const { y: yPosition } =
          headingWithCurrentAnchor.element.getBoundingClientRect();

        window.scrollTo({
          top: yPosition + window.scrollY - 100,
        });

        if (detectHeadingFromScrollTimer) {
          clearTimeout(detectHeadingFromScrollTimer);
        }
        detectHeadingFromScrollTimer = setTimeout(() => {
          detectHeadingFromScroll.current = true;
        }, 1500);
      }
    }

    return () => {
      if (detectHeadingFromScrollTimer) {
        clearTimeout(detectHeadingFromScrollTimer);
      }
    };
  }, [headings, router.asPath]);

  useEffect(() => {
    headingsRef.current = headings;
  }, [headings]);

  // Automatic anchor setting is currently disabled to prevent jumpy scrolls

  /*
  useEffect(() => {
    const onScroll = () => {
      if (
        !detectHeadingFromScroll.current ||
        headingsRef.current.length === 0
      ) {
        return;
      }

      let headingAtScrollPosition: Heading = headingsRef.current[0]!;

      for (const heading of headingsRef.current.slice(1)) {
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
        currentHeading.current = headingAtScrollPosition;

        void router
          .replace(
            `${asPath.split("#")[0]}${
              headingAtScrollPosition.anchor
                ? `#${headingAtScrollPosition.anchor}`
                : ""
            }`,
            undefined,
            { shallow: true },
          )
          .catch(() => {
            // Prevents unhandled "Cancel rendering route" error
            // Happens during fast scrolling between page sections
          });
      }
    };

    const throttledOnScroll = throttle(onScroll, 1000);

    window.addEventListener("scroll", throttledOnScroll);

    return () => {
      window.removeEventListener("scroll", throttledOnScroll);
    };
  }, [router]);
  */

  const contextValue = useMemo(
    () => ({
      headings,
      setHeadings,
    }),
    [headings],
  );

  return (
    <PageHeadingsContext.Provider value={contextValue}>
      <Box
        {...boxProps}
        sx={{
          width: "100%",
          overflow: "auto",
          "& > :not(.info-card-wrapper, .github-info-card), > a:not(.info-card-wrapper) > *":
            {
              maxWidth: {
                xs: "100%",
                sm: MDX_TEXT_CONTENT_MAX_WIDTH,
              },
            },
          /** Headers that come after headers shouldn't have a top margin */
          "& h2 + h3, h2 + h4, h2 + h5, h3 + h4, h3 + h5, h4 + h5": {
            marginTop: 0,
          },
          "& > h1:first-of-type": {
            marginTop: 0,
          },
        }}
      >
        <MDXRemote {...serializedPage} components={mdxComponents} />
      </Box>
    </PageHeadingsContext.Provider>
  );
};
