import React, { useRef, useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";

import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeftIcon } from "../../SvgIcon/ArrowLeft";
import { ArrowRightIcon } from "../../SvgIcon/ArrowRight";

const steps = [
  {
    id: 1,
    image: "/assets/person-with-paragraph-block.svg",
    graphImg: "/assets/person-with-paragraph-block-tree.svg",
    graphImgMobile: "/assets/person-with-paragraph-block-tree-mobile.svg",
  },
  {
    id: 2,
    image: "/assets/table-block.svg",
    graphImg: "/assets/table-block-tree.svg",
    graphImgMobile: "/assets/table-block-tree-mobile.svg",
  },
  {
    id: 3,
    image: "/assets/checklist-block.svg",
    graphImg: "/assets/sequence-3.svg",
    graphImgMobile: "/assets/checklist-block-tree-mobile.svg",
  },
  {
    id: 4,
    image: "/assets/kanban-small-block.svg",
    graphImg: "/assets/kanban-small-block-tree.svg",
    graphImgMobile: "/assets/kanban-small-block-tree-mobile.svg",
  },
];

export const IntroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(1);

  const slider = useRef<Slider>();

  const settings = useMemo(
    () =>
      ({
        // centerMode: true,
        infinite: !isMobile,
        slidesToShow: isMobile ? 1 : 2,
        swipeToSlide: true,
        speed: 500,
        initialSlide: isMobile ? 0 : 1,
        arrows: false,
        customPaging: () => (
          <Box
            sx={{
              height: "12px",
              width: "12px",
              borderRadius: "50%",
            }}
          />
        ),
        beforeChange: (_, next) => setActiveStep(next),
        dots: true,
      } as Settings),
    [isMobile],
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
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
            display: "flex",
            width: "100%",
            height: { xs: 250, md: 400 },
            justifyContent: "center",
            alignItems: "flex-end",
            mx: "auto",
            position: "relative",
          }}
        >
          {steps.map(({ graphImg, graphImgMobile, id }) => (
            <Fade in={activeStep + 1 === id} key={id}>
              <Box
                key={id}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: { xs: "90%", sm: "100%" },
                  maxWidth: 1444,
                }}
                src={isMobile ? graphImgMobile : graphImg}
                component="img"
              />
            </Fade>
          ))}
        </Box>
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            "& .slick-track": {
              paddingLeft: { md: "25%" }, // padding left = (100%/ no of slide to show)/2; https://github.com/kenwheeler/slick/issues/1784#issuecomment-831722031,
              display: "flex",
              alignItems: "center",
            },
            "& .slick-dots": {
              "li div": {
                backgroundColor: ({ palette }) => palette.gray[30],
              },
              "li.slick-active div": {
                backgroundColor: ({ palette }) => palette.purple[700],
              },
            },
          }}
        >
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
                  height: { xs: 300, md: 400 },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    display: "block",
                    width: { xs: "90%", md: "auto" },
                    boxShadow: 2,
                  }}
                  src={image}
                />
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
