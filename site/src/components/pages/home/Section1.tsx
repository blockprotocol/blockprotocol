import React, { useRef, useState } from "react";
import { Container, Typography, Box, MobileStepper } from "@mui/material";

// import dynamic from "next/dynamic"
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeftIcon } from "../../SvgIcon/ArrowLeft";
import { ArrowRightIcon } from "../../SvgIcon/ArrowRight";

const steps = [
  {
    image: "/assets/person-with-paragraph.png",
  },
  {
    image: "/assets/table-block.png",
    width: 300,
  },
  {
    image: "/assets/checklist-block.png",
    width: 244,
  },
  {
    image: "/assets/kanban-small-block.png",
    width: 620,
  },
];

const PrevArrow = ({ onClick, ...props }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 0,
        zIndex: 10,
        transform: "translateY(-50%)",
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
          //   check support for filter
          filter: `drop-shadow(0px 1px 2px rgba(27, 58, 117, 0.12)) drop-shadow(0px 4px 8px rgba(27, 58, 117, 0.07))`,
          //   boxShadow: 1
        }}
      >
        <ArrowLeftIcon sx={{ width: 24, height: 24 }} />
      </Box>
    </Box>
  );
};

const NextArrow = ({ onClick, ...props }) => {
  console.log("props ==> ", props);
  //   const slider = useRef();
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 0,
        zIndex: 10,
        transform: "translateY(-50%)",
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
          //   check support for filter
          filter: `drop-shadow(0px 1px 2px rgba(27, 58, 117, 0.12)) drop-shadow(0px 4px 8px rgba(27, 58, 117, 0.07))`,
          //   boxShadow: 1
        }}
      >
        <ArrowRightIcon sx={{ width: 24, height: 24 }} />
      </Box>
    </Box>
  );
};

export const Section1 = () => {
  const [activeStep, setActiveStep] = useState(0);
  const slider = useRef<Slider>();

  const settings = {
    // className: "center",
    // centerMode: true,
    centerPadding: "50px",
    // infinite: true,
    slidesToShow: 4,
    // swipeToSlide: true,
    speed: 500,
    initialSlide: 1,
    // variableWidth: true,
    // nextArrow: <NextArrow />,
    // prevArrow: <PrevArrow />,
  } as Settings;

  return (
    <Box sx={{ pt: 16, minHeight: "100vh" }}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "64%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="bpHeading2" sx={{ mb: 3 }} textAlign="center">
            Embed any block anywhere on the web, using data from any source
          </Typography>
          <Typography sx={{ width: "56%" }} textAlign="center">
            Easily move data between applications without wrestling with APIs
            and custom integrations. View it any way you like in interactive
            blocks.
          </Typography>
        </Box>
      </Container>
      <Box sx={{ border: "1px solid red", position: "relative" }}>
        <Slider ref={slider} {...settings}>
          {[...steps, ...steps].map(({ image, width }) => (
            <Box
              sx={{
                border: "1px solid blue",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box component="img" sx={{}} src={image} />
            </Box>
          ))}
        </Slider>
        <Box>
          <Box
            onClick={() => slider.current?.slickPrev()}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              zIndex: 10,
              transform: "translateY(-50%)",
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
            >
              <ArrowLeftIcon sx={{ width: 24, height: 24 }} />
            </Box>
          </Box>
          <Box
            onClick={() => slider.current?.slickNext()}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              zIndex: 10,
              transform: "translateY(-50%)",
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
            >
              <ArrowRightIcon sx={{ width: 24, height: 24 }} />
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              height: 10,
              width: 10,
              backgroundColor: "red",
            }}
          >
            N
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
