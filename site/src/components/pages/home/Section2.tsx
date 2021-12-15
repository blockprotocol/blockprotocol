import React, { useState, useRef, useLayoutEffect } from "react";
import { Container, Typography, Box, Fade } from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { InlineLink } from "../../InlineLink";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  },
];

export const Section2 = () => {
  const [activeImg, setActiveImg] = useState(0);
  const boxRef = useRef(null);
  const pinElRef = useRef(null);

  useLayoutEffect(() => {
    if (!window || !pinElRef.current || !boxRef.current) return;

    const markers: Element[] = gsap.utils.toArray(".box");

    const triggers: ScrollTrigger[] = [];

    markers.forEach((marker) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: marker,
          start: "top center",
          end: "bottom 50vh",
          onEnter: () => {
            setActiveImg(markers.indexOf(marker));
          },
          onEnterBack: () => {
            setActiveImg(markers.indexOf(marker));
          },
        }),
      );
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: boxRef.current,
        // scrub: true,
        start: "top top",
        end: "bottom bottom",
        pin: pinElRef.current,
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, []);

  return (
    <Box sx={{ pt: { xs: 2, md: 10 } }}>
      <Container
        ref={boxRef}
        sx={{
          display: "flex",
          height: { xs: "100vh", md: "unset" },
          flexDirection: { xs: "column", md: "row" },
          maxWidth: "100vw",
          // border: "1px solid blue",
          // alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            // flexBasis: "50%",
            width: { xs: "100%", md: "40%" },
            height: { xs: "50vh", md: "unset" },
            mr: 4,
            overflowY: { xs: "scroll", md: "unset" },
          }}
        >
          {CONTENT.map(({ id, title, content }) => (
            <Box
              className="box"
              sx={{
                typography: "bpBodyCopy",
                minHeight: { xs: "auto", md: "70vh" },
                display: "flex",
                flexDirection: "column",
                pt: "20vh",
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
            flex: 1,
            alignSelf: "flex-start",
            height: { xs: "50vh", md: "100vh" },
            position: "relative",
            backgroundColor: ({ palette }) => palette.common.white,
          }}
        >
          {CONTENT.map(({ image, id }, index) => (
            <Fade key={id} in={activeImg === index}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  pt: "20vh",
                  display: "flex",
                  justifyContent: "center",
                  // border: "1px solid red",
                }}
              >
                <Box id={`step-${id}`} component="img" src={image} />
              </Box>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
