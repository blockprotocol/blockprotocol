import {
  Box,
  Container,
  Fade,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useLayoutEffect, useRef, useState } from "react";

import { Step1, Step2, Step3, Step4 } from "./Steps";

const CONTENT = [
  {
    id: 1,
    title: "What do you mean by ‘blocks’?",
    content: (
      <Box>
        Blocks are individual pieces of content on the web – images, text,
        videos, checklists, and kanban boards are all examples of blocks.
        <br />
        <br />
        You’ve seen these around the web. They’re used in almost every modern
        web application
      </Box>
    ),
    renderComponent: (isMobile: boolean) => <Step1 isMobile={isMobile} />,
  },
  {
    id: 2,
    title:
      "Usually these blocks and the data they contain are confined to single apps and websites",
    content: (
      <Box>
        You can’t easily move data from a to-do list on one website into a
        kanban board on another.
        <br />
        <br />
        Unless you want to manually copy-paste it, or another developer has
        built the API integration for you.
      </Box>
    ),
    renderComponent: (isMobile: boolean) => <Step2 isMobile={isMobile} />,
  },
  {
    id: 3,
    title:
      "Blocks created using the Block Protocol can easily move between apps",
    content: (
      <Box>
        These blocks use structured data which makes it easy to move both blocks
        themselves, and the data within blocks, even if the blocks are in
        completely separate applications.
      </Box>
    ),
    renderComponent: (isMobile: boolean, isActive?: boolean) => (
      <Step3 isMobile={isMobile} isActive={isActive} />
    ),
  },
  {
    id: 4,
    title: "What’s structured data?",
    content: (
      <Box>
        <strong>Structured data is any data that maps to a schema</strong>
        <br />
        <br />
        Schemas are standardized formats that define the possible properties of
        a thing, the expected types of those properties, and (sometimes) their
        expected values.
        <br />
        <br />
        So the schema for a <strong>Person</strong> has the properties{" "}
        <strong>firstName</strong>, <strong>jobTitle</strong>, and{" "}
        <strong>email.</strong>
        <br />
        <br />
        While the <strong>schema</strong> for an <strong>ItemList</strong> has
        the properties <strong>numberOfItems</strong> (a number) and
        <strong>ListItems</strong> (an array of strings).
        <br />
        <br />
        This standard format makes it easy for us to pass an ItemList between
        different kinds of blocks, no matter which application the blocks are
        embedded in.
      </Box>
    ),
    renderComponent: (isMobile: boolean) => <Step4 isMobile={isMobile} />,
  },
];

const CONTENT_CLASS_NAME = "scroll-section";

export const Section2 = () => {
  const [activeImg, setActiveImg] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const pinElRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useLayoutEffect(() => {
    if (!window || !boxRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            const newActiveImg = Number(entry.target.dataset.key);
            if (newActiveImg !== activeImg) {
              setActiveImg(newActiveImg);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: `-50% 0% -50% 0%`,
      },
    );

    const elements = boxRef.current.querySelectorAll(`.${CONTENT_CLASS_NAME}`);

    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ pt: 0 }}>
      <Container
        ref={boxRef}
        sx={{
          display: "flex",
          px: 0,
          flexDirection: { xs: "column", lg: "row" },
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", lg: "40%" },
            mr: { lg: 4 },
          }}
        >
          {CONTENT.map(({ id, title, content }) => (
            <Box
              className={CONTENT_CLASS_NAME}
              data-key={id}
              sx={{
                typography: "bpBodyCopy",
                minHeight: { xs: "auto", lg: "70vh" },
                display: "flex",
                flexDirection: "column",
                px: { xs: "5%" },
                pt: { lg: "16vh" },
                ":first-of-type": {
                  pt: { xs: 10, lg: "20vh" },
                },
                mb: 10,
              }}
              key={id}
            >
              <Typography variant="bpHeading3" mb={3}>
                {title}
              </Typography>
              {content}
            </Box>
          ))}
        </Box>
        <Box
          ref={pinElRef}
          sx={{
            flex: { xs: "unset", lg: 1 },
            alignSelf: "flex-start",
            height: { xs: "40vh", lg: "80vh" },
            position: "sticky",
            zIndex: 2,
            top: { xs: "unset", lg: 0 },
            bottom: { xs: 0, lg: "unset" },
            left: 0,
            right: 0,
            width: { xs: "100%", lg: "auto" },
            marginLeft: { md: 0, lg: 8 },

            borderTop: ({ palette }) =>
              activeImg
                ? {
                    xs: `1px solid ${palette.gray[30]}`,
                    lg: "none",
                  }
                : "none",
            backgroundColor: ({ palette }) => palette.common.white,
          }}
        >
          {CONTENT.map(({ id, renderComponent }) => (
            <Fade key={id} in={activeImg === id}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: { xs: 0, lg: "unset" },
                  pt: { lg: "14vh" },
                  px: { xs: "5%", lg: 0 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: { xs: "center", lg: "flex-start" },
                }}
              >
                {renderComponent(isMobile, activeImg === id)}
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
