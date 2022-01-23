import {
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import React, { Fragment, useLayoutEffect, useRef, useState } from "react";
import { Spacer } from "../../Spacer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TodoListBlock = () => {
  return (
    <Box
      sx={{
        width: 290,
        p: 3,
        backgroundColor: ({ palette }) => palette.common.white,
        boxShadow: 1,
        borderRadius: 0.75,
      }}
    >
      {[
        "Fix color contrast",
        "Implement sidebar",
        "Write tests",
        "Review latest PRs",
      ].map((text, index) => (
        <Box key={text}>
          <FormControlLabel
            control={
              <Checkbox
                sx={{ padding: 0, pr: 1.5 }}
                checked={[2, 3].includes(index)}
              />
            }
            label={text}
          />
        </Box>
      ))}
    </Box>
  );
};

const blockBorderColor = "#5F6483";

const TableBlock = () => {
  return (
    <Grid
      container
      sx={{
        borderRadius: 0.75,
        border: `1px solid ${blockBorderColor}`,
        borderBottom: "none",
        color: ({ palette }) => palette.purple[300],
        width: { xs: "100%", sm: 440 },
        fontSize: { xs: 16, lg: 18 },
      }}
      columns={12}
    >
      {[
        ["item: Fix color contrast", "complete: false"],
        ["item: Implement sidebar", "complete: false"],
        ["item: Write tests", "complete: true"],
        ["item: Review latest PRS", "complete: true"],
      ].map(([col0, col1]) => (
        <Fragment key={[col0, col1].join("-")}>
          <Grid
            sx={{
              py: 1.5,
              px: { xs: 1, md: 2 },
              borderRight: `1px solid ${blockBorderColor}`,
              borderBottom: `1px solid ${blockBorderColor}`,
            }}
            item
            xs={7}
          >
            <Box sx={{ whiteSpace: "nowrap" }}>{col0}</Box>
          </Grid>
          <Grid
            sx={{
              py: 1.5,
              px: { xs: 1, md: 2 },
              borderBottom: `1px solid ${blockBorderColor}`,
            }}
            item
            xs={5}
          >
            <Box sx={{ whiteSpace: "nowrap" }}>{col1}</Box>
          </Grid>
        </Fragment>
      ))}
    </Grid>
  );
};

const CONTENT = [
  {
    id: 1,
    content: (
      <Typography
        sx={{
          color: ({ palette }) => palette.common.white,
          textAlign: "center",
        }}
      >
        We could pull in data from a checklist block on our favorite to-do
        app...
      </Typography>
    ),
  },
  {
    id: 2,
    content: (
      <Typography sx={{ color: ({ palette }) => palette.purple[200] }}>
        which maps onto an{" "}
        <Box
          sx={{
            color: ({ palette }) => palette.purple[400],
            fontWeight: 700,
          }}
          component="span"
        >
          ItemList
        </Box>{" "}
        schema...
      </Typography>
    ),
  },
  {
    id: 3,
    content: (
      <Typography
        sx={{
          color: ({ palette }) => palette.purple[200],
          textAlign: "center",
        }}
      >
        and access that same list in a{" "}
        <Box
          sx={{
            color: ({ palette }) => palette.purple[400],
            fontWeight: 700,
          }}
          component="span"
        >
          Table{" "}
        </Box>
        or{" "}
        <Box
          sx={{
            color: ({ palette }) => palette.purple[400],
            fontWeight: 700,
          }}
          component="span"
        >
          Kanban{" "}
        </Box>
        block in other applications
      </Typography>
    ),
  },
];

export const WhyBlockProtocol1Section = () => {
  const pinRef = useRef(null);
  const boxRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useLayoutEffect(() => {
    if (!boxRef.current || !pinRef.current) return;

    const markers: Element[] = gsap.utils.toArray(".item");

    const triggers: ScrollTrigger[] = [];

    markers.forEach((marker) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: marker,
          start: "top center",
          end: "bottom center+=50",
          onEnter: () => {
            const markerIndex = markers.indexOf(marker);
            if (markerIndex > 0) {
              setActiveStep(1);
            } else {
              setActiveStep(0);
            }
          },
          onEnterBack: () => {
            const markerIndex = markers.indexOf(marker);
            if (markerIndex > 0) {
              setActiveStep(1);
            } else {
              setActiveStep(0);
            }
          },
        }),
      );
    });

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
    };
  }, [isMobile]);

  return (
    <Box
      sx={{
        pt: 10,
        position: "relative",
      }}
      ref={boxRef}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "55%" }, textAlign: "center" }}>
          <Typography variant="bpHeading2" mb={3}>
            Why would I want to build blocks with the Block Protocol?
          </Typography>
          <Typography mb={4}>
            Blocks built with the <strong>Block Protocol</strong> can easily
            pass data between applications because the data within each block is{" "}
            <strong>structured.</strong>
          </Typography>
        </Box>
      </Container>

      <Box
        sx={{
          background: `radial-gradient(99.32% 99.32% at 50% 0.68%, #3F4553 0.52%, #1C1B25 100%)`,
          mt: 10,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: { lg: "30%" },
          }}
        >
          <Box
            ref={pinRef}
            sx={{
              mt: -10,
              zIndex: 1,
              width: "100%",
              position: "sticky",
              top: "45vh",
            }}
          >
            {[
              { id: 1, component: <TodoListBlock /> },
              { id: 2, component: <TableBlock /> },
            ].map(({ id, component }, index) => (
              <Fade
                key={id}
                in={activeStep === index}
                timeout={{ enter: 750, exit: 500 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 2,
                    ...(id === 1 && {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }),
                  }}
                >
                  {component}
                </Box>
              </Fade>
            ))}
          </Box>
          <Spacer height={13} />

          {CONTENT.map(({ content, id }) => (
            <Box
              key={id}
              className="item"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "60vh",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#373B49",
                  zIndex: 2,
                  width: { md: "80%" },
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  boxShadow: 1,
                  p: 1.5,
                  borderRadius: "4px",
                }}
              >
                {content}
              </Box>
            </Box>
          ))}
        </Container>
      </Box>
    </Box>
  );
};
