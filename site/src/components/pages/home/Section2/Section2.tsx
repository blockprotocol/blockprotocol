import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { InlineLink } from "../../../InlineLink";
import { Step1, Step2, Step3, Step4 } from "./StepBlocks";

const CONTENT = [
  {
    id: 1,
    title: "What do you mean by 'blocks'?",
    content: (
      <Box>
        <InlineLink popperInfo={{ title: "Blocks", content: "A block is" }}>
          Blocks
        </InlineLink>{" "}
        are individual pieces of content on the web – images, text, videos,
        checklists, and kanban boards are all examples of blocks.
        <br />
        <br />
        You’ve seen these around the web. They’re used in almost every modern
        web application
      </Box>
    ),
    image: "/assets/step-1-img.svg",
    renderComponent: (isMobile: boolean, isActive?: boolean) => (
      <Step1 isMobile={isMobile} />
    ),
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
    image: "/assets/step-2-img.svg",
    renderComponent: (isMobile: boolean, isActive?: boolean) => (
      <Step2 isMobile={isMobile} />
    ),
  },
  {
    id: 3,
    title:
      "Blocks created using the Block Protocol can easily move between apps",
    content: (
      <Box>
        These blocks use{" "}
        <InlineLink popperInfo={{ title: "structured data", content: "info" }}>
          structured data
        </InlineLink>{" "}
        which makes it easy to move both block themselves, and the data within
        blocks, even if the blocks are in completely seperate applications.
      </Box>
    ),
    image: "/assets/step-3-img.svg",
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
        <InlineLink popperInfo={{ title: "Schemas", content: "info" }}>
          Schemas
        </InlineLink>{" "}
        are standardized formats that define the possible properties of a thing,
        the expected types of those properties, and (sometimes) their expected
        values.
        <br />
        <br />
        So the schema for a <strong>Person</strong> has the properties{" "}
        <strong>firstName</strong>, <strong>jobTitle</strong>, and{" "}
        <strong>email.</strong>
        <br />
        <br />
        While the <strong>schema</strong> for an <strong>ItemList</strong> has
        the properties <strong>numberOfItems</strong> (a number) and any number
        of <strong>ListItems</strong> (an array of strings).
        <br />
        <br />
        This standard format makes it easy for us to pass an ItemList between
        different kinds of blocks, no matter which application the blocks are
        embedded in.
      </Box>
    ),
    image: "/assets/step-4-img.svg",
    renderComponent: (isMobile: boolean, isActive?: boolean) => (
      <Step4 isMobile={isMobile} />
    ),
  },
];

const CONTENT_CLASS_NAME = "scroll-section";

export const Section2 = () => {
  const [activeImg, setActiveImg] = useState(CONTENT[0].id);
  const boxRef = useRef<HTMLDivElement>(null);
  const pinElRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    console.log("re-rendered");
  });

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
  }, []);

  return (
    <Box sx={{ pt: { xs: 2, md: 10 } }}>
      <Container
        ref={boxRef}
        sx={{
          display: "flex",
          px: 0,
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "40%" },
            mr: { md: 4 },
          }}
        >
          {CONTENT.map(({ id, title, content }) => (
            <Box
              className={CONTENT_CLASS_NAME}
              data-key={id}
              sx={{
                typography: "bpBodyCopy",
                minHeight: { xs: "auto", md: "70vh" },
                display: "flex",
                flexDirection: "column",
                px: { xs: "5%" },
                pt: { md: "20vh" },
                ":first-of-type": {
                  pt: { xs: 10, md: "20vh" },
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
            flex: { xs: "unset", md: 1 },
            alignSelf: "flex-start",
            height: { xs: "50vh", md: "100vh" },
            position: "sticky",
            // position: "fixed",
            zIndex: 2,
            top: { xs: "unset", md: 0 },
            bottom: { xs: 0, md: "unset" },
            left: 0,
            right: 0,
            width: { xs: "100%", md: "auto" },
            borderTop: ({ palette }) => ({
              xs: `1px solid ${palette.gray[30]}`,
              md: "none",
            }),
            backgroundColor: ({ palette }) => palette.common.white,
          }}
        >
          {CONTENT.map(({ image, id, renderComponent }) => (
            <Fade key={id} in={activeImg === id}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: { xs: 0, md: "unset" },
                  pt: { md: "20vh" },
                  px: { xs: "5%", lg: 0 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: { xs: "center", md: "flex-start" },
                }}
              >
                {/* <Box
                  sx={{ height: { xs: "40vh", md: "auto" } }}
                  component="img"
                  src={image}
                /> */}
                {renderComponent(isMobile, activeImg === id)}
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
