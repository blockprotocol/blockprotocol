import React, { useRef } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// import dynamic from "next/dynamic"
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeftIcon } from "../../SvgIcon/ArrowLeft";
import { ArrowRightIcon } from "../../SvgIcon/ArrowRight";

const steps = [
  {
    id: 1,
    image: "/assets/person-with-paragraph.svg",
  },
  {
    id: 2,
    image: "/assets/table-block.svg",
    width: 300,
  },
  {
    id: 3,
    image: "/assets/checklist-block.svg",
    width: 244,
  },
  {
    id: 4,
    image: "/assets/kanban-small-block.svg",
    width: 620,
  },
];

// @todo consider implementing this with gsap

export const Section1 = () => {
  // const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const slider = useRef<Slider>();

  const settings = {
    className: "center",
    centerMode: true,
    // centerPadding: "50px",
    infinite: true,
    slidesToShow: isMobile ? 1 : 3,
    swipeToSlide: true,
    speed: 500,
    initialSlide: isMobile ? 0 : 1,
    nextArrow: <Box sx={{ display: "none !important" }} />,
    prevArrow: <Box sx={{ display: "none !important" }} />,
  } as Settings;

  return (
    <Box sx={{ width: "100%" }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "64%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="bpHeading2" sx={{ mb: 3 }} textAlign="center">
            Embed any block anywhere on the web, using data from any source
          </Typography>
          <Typography sx={{ width: { md: "56%" } }} textAlign="center">
            Easily move data between applications without wrestling with APIs
            and custom integrations. View it any way you like in interactive
            blocks.
          </Typography>
        </Box>
      </Container>
      <Box sx={{ position: "relative", maxWidth: "100%" }}>
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* @todo consider using a custom carousel */}
          <Slider
            ref={(node) => {
              if (node) {
                slider.current = node;
              }
            }}
            {...settings}
          >
            {steps.map(({ image, id }) => (
              <Box
                key={id}
                sx={{
                  display: "flex !important",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <Box component="img" sx={{}} src={image} />
              </Box>
            ))}
          </Slider>
          <Box>
            {["prev", "next"].map((position) => (
              <Box
                key={position}
                sx={{
                  position: "absolute",
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  top: 0,
                  bottom: 0,
                  ...(position === "prev"
                    ? {
                        left: 0,
                        pl: 4.5,
                        justifyContent: "flex-start",
                      }
                    : {
                        right: 0,
                        pr: 4.5,
                        justifyContent: "flex-end",
                      }),
                  width: 200,
                  zIndex: 10,
                  background: `linear-gradient(to ${
                    position === "prev" ? "right" : "left"
                  }, #FFFFFF 55%, transparent)`,
                }}
              >
                <Box
                  sx={{
                    height: 44,
                    width: 44,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    cursor: "pointer",
                    //   check support for filter
                    filter: `drop-shadow(0px 1px 2px rgba(27, 58, 117, 0.12)) drop-shadow(0px 4px 8px rgba(27, 58, 117, 0.07))`,
                    //   boxShadow: 1
                  }}
                  onClick={() =>
                    position === "next"
                      ? slider.current?.slickNext()
                      : slider.current?.slickPrev()
                  }
                >
                  {position === "prev" ? (
                    <ArrowLeftIcon sx={{ width: 24, height: 24 }} />
                  ) : (
                    <ArrowRightIcon sx={{ width: 24, height: 24 }} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            height: 296,
            backgroundColor: "gray.10",
            mt: -28,
            borderBottom: ({ palette }) => `1px solid ${palette.gray[30]}`,
          }}
        />
      </Box>
    </Box>
  );
};
