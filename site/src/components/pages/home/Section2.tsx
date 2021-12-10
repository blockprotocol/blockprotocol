import React, { useRef, useLayoutEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
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
  },
];

export const Section2 = () => {
  const boxRef = useRef(null);
  //   const scrollTriggerRef = useRef(null);

  useLayoutEffect(() => {
    // if (!window) return;

    // const trigger = ScrollTrigger.create({
    //   trigger: boxRef.current,
    //   start: "top top",
    //   end: "bottom bottom",
    //   // pin: ".right-content",
    //   pin: true,
    //   markers: true,
    // });

    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: boxRef.current,
    //     start: "top top",
    //     end: "bottom bottom",
    //     pin: ".right-content",
    //   },
    // });

    return () => {
      // trigger.kill()
      //   tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <Box sx={{ pt: 20 }}>
      <Container sx={{ display: "flex" }}>
        <Box ref={boxRef} sx={{ width: "40%", mr: 4 }}>
          {CONTENT.map(({ id, title, content }) => (
            <Box
              className="box"
              sx={{
                typography: "bpBodyCopy",
                height: "60vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
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
          className="right-content"
          sx={{
            border: "1px solid red",
            flex: 1,
            height: "70vh",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: 200,
              width: 200,
              backgroundColor: "red",
              position: "absolute",
              left: "50%",
              top: "50%",
            }}
          >
            Right
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
