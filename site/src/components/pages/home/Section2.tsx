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

  useLayoutEffect(() => {
    if (!window) return;

    // const markers = gsap.utils.toArray(".box");

    // const el = document.querySelectorAll(".stuff > img");

    // markers.forEach((marker) => {
    // let img: HTMLImageElement | undefined;
    // el.forEach((node) => {
    //   if (node.id === `step-${markers.indexOf(marker)}`) {
    //     img = node;
    //   }
    // });
    // ScrollTrigger.create({
    //   trigger: marker,
    //   start: "top top",
    //   end: "bottom bottom",
    //   onEnter: () => {
    //     console.log("Enter img ==> ", img);
    //     //   @todo probably reset other images and leave the main one in question
    //     gsap.fromTo(
    //       // @todo temporarily added this to please typescript... Remove
    //       img!,
    //       {
    //         autoAlpha: 0,
    //       },
    //       {
    //         autoAlpha: 1,
    //       },
    //     );
    //   },
    //   // onEnterBack: () => {
    //   //   gsap.fromTo(
    //   //     img,
    //   //     {
    //   //       autoAlpha: 0,
    //   //     },
    //   //     { autoAlpha: 1 },
    //   //   );
    //   // },
    //   onLeave: () => {
    //     console.log("Leave img ==> ", img);
    //     //   gsap.fromTo(img, {
    //     //     autoAlpha: 1,
    //     //   }, {
    //     //       autoAlpha: 0
    //     //   });
    //   },
    //   // markers: true,
    // });
    // });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: ".right-content",
        // toggleActions: "play none none reverse",
        // markers: true
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      <Container
        ref={boxRef}
        sx={{
          display: "flex",
          height: { md: "auto" },
          flexDirection: { md: "row" },
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            width: { md: "40%" },
            height: { md: "auto" },
            mr: 4,
          }}
        >
          {CONTENT.map(({ id, title, content }) => (
            <Box
              // className="box"
              sx={{
                typography: "bpBodyCopy",
                height: { xs: "auto", md: "70vh" },
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
          // className="right-content"
          sx={{
            // border: "1px solid red",
            flex: 1,
            height: { md: "90vh" },
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Box
          // className="stuff"
          >
            {/* <Step1 /> */}
            {[
              "/assets/step-1-img.svg",
              "/assets/step-2-img.svg",
              "/assets/step-3-img.svg",
              "/assets/step-4-img.svg",
            ].map((src, index) => (
              <Box
                id={`step-${index}`}
                sx={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: "hidden",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                key={src}
                component="img"
                src={src}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

// const Step1 = () => {
//   return <Box></Box>;
// };
