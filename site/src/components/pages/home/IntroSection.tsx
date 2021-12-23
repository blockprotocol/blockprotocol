import React, { useState, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";

import { Carousel } from "../../Carousel";

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
    graphImg: "/assets/checklist-block-tree.svg",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(1);

  const sliderSettings = useMemo(
    () => ({
      centerMode: true,
      infinite: !isMobile,
      slidesToShow: isMobile ? 1 : 2,
      initialSlide: isMobile ? 0 : 1,
      beforeChange: (_: number, next: number) => setActiveStep(next),
      dots: true,
    }),
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
          <Typography
            sx={{ width: { md: "75%", lg: "56%" } }}
            textAlign="center"
          >
            Easily move data between applications without wrestling with APIs
            and custom integrations. View it any way you like in interactive
            blocks.
          </Typography>
        </Box>
      </Container>
      <Box sx={{ position: "relative", maxWidth: "100%" }}>
        {/* GRAPH SECTION */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: { xs: 300, sm: 350, md: 400 },
            justifyContent: "center",
            alignItems: "flex-end",
            mx: "auto",
            position: "relative",
            mb: { xs: -6, sm: -4 },
          }}
        >
          {steps.map(({ graphImg, graphImgMobile, id }) => (
            <Fade in={activeStep + 1 === id} key={id} timeout={1000}>
              <Box
                key={id}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: { xs: "90%", sm: "50%", md: "100%" },
                  maxWidth: { xs: 380, md: 1444 },
                }}
                src={isMobile ? graphImgMobile : graphImg}
                component="img"
              />
            </Fade>
          ))}
        </Box>
        {/* CAROUSEL SECTION */}
        <Box
          sx={{
            position: "relative",
            "&:after": {
              content: `""`,
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: "40%",
              backgroundColor: ({ palette }) => palette.gray[10],
              zIndex: 1,
            },
          }}
        >
          <Carousel
            sx={{
              "& .slick-track": {
                paddingLeft: { xs: 0, md: "25%" }, // padding left = (100%/ no of slide to show)/2; https://github.com/kenwheeler/slick/issues/1784#issuecomment-831722031,
                display: "flex",
                alignItems: "center",
              },
              position: "relative",
              zIndex: 2,
            }}
            data={steps}
            itemKey={({ id }) => id.toString()}
            renderItem={({ image, id }) => (
              <Box
                key={id}
                sx={{
                  display: "flex !important",
                  justifyContent: { xs: "center", md: "flex-end" },
                  alignItems: "center",
                  height: { xs: 300, lg: 400 },
                }}
              >
                <Box
                  component="img"
                  sx={{
                    display: "block",
                    width: { xs: "90%", lg: "auto" },
                    maxWidth: 450,
                    boxShadow: 2,
                  }}
                  src={image}
                />
              </Box>
            )}
            edgeBackground={{
              left: `linear-gradient(89.92deg, #FFFFFF 50%, rgba(255, 255, 255, 0) 90%)`,
              right: `linear-gradient(89.92deg, rgba(255, 255, 255, 0) 10%, #FFFFFF 45%)`,
            }}
            settings={sliderSettings}
          />
        </Box>
      </Box>
    </Box>
  );
};
