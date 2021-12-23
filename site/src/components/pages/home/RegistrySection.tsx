import React, { useMemo, useRef } from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import Slider, { Settings } from "react-slick";
import { Link } from "../../Link";
import { Spacer } from "../../Spacer";
import { Button } from "../../Button";
import { BlockHubIcon } from "../../SvgIcon/BlockHubIcon";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeftIcon } from "../../SvgIcon/ArrowLeft";
import { ArrowRightIcon } from "../../SvgIcon/ArrowRight";

// @todo this should be populated with data from registry
// @todo build reusable carousel component

const ITEMS = [
  {
    id: 1,
    title: "Table",
    image: "/assets/table-block.svg",
    hideBoxShadow: false,
  },
  {
    id: 2,
    title: "Code",
    image: "/assets/code-block.svg",
    hideBoxShadow: false,
  },
  {
    id: 3,
    title: "Headings",
    image: "/assets/heading-block.svg",
    hideBoxShadow: true,
  },
  {
    id: 4,
    title: "Table",
    image: "/assets/table-block.svg",
    hideBoxShadow: false,
  },
  {
    id: 5,
    title: "Code",
    image: "/assets/code-block.svg",
    hideBoxShadow: false,
  },
  {
    id: 6,
    title: "Headings",
    image: "/assets/heading-block.svg",
    hideBoxShadow: true,
  },
  {
    id: 7,
    title: "Headings",
    image: "/assets/heading-block.svg",
    hideBoxShadow: true,
  },
  {
    id: 9,
    title: "Code",
    image: "/assets/code-block.svg",
    hideBoxShadow: false,
  },
  {
    id: 10,
    title: "Headings",
    image: "/assets/heading-block.svg",
    hideBoxShadow: true,
  },
  {
    id: 8,
    title: "Headings",
    image: "/assets/heading-block.svg",
    hideBoxShadow: true,
  },
];

export const RegistrySection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const slider = useRef<Slider>();

  const settings = useMemo(
    () =>
      ({
        centerMode: true,
        infinite: false,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        initialSlide: 0,
        nextArrow: <Box sx={{ display: "none !important" }} />,
        prevArrow: <Box sx={{ display: "none !important" }} />,
        customPaging: () => (
          <Box
            sx={{
              height: "12px",
              width: "12px",
              borderRadius: "50%",
            }}
          />
        ),
        dots: true,
      } as Settings),
    [isMobile],
  );

  return (
    <Box
      sx={{
        mb: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mx: "auto",
        width: { xs: "90%", md: "100%" },
        textAlign: "center",
      }}
    >
      {/* @todo set a max-width for larger screens */}
      <Typography variant="bpHeading2" mb={3}>
        Tap into a global registry of reusable blocks
      </Typography>
      <Typography sx={{ mb: 6, width: { xs: "100%", md: "44%" } }}>
        As a developer, building your applications using the{" "}
        <strong>Block Protocol</strong> will give you access to a global
        registry of reusable, flexible blocks to embed inside your application.
        All connected to powerful structured data formats.
      </Typography>

      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.gray[20],
          overflow: "hidden",

          width: "100%",
          mb: 6,
          position: "relative",
          zIndex: 2,
          py: 8,
          // "& .slick-slide": {
          //   // mx: 2,
          //   margin: "0 32px",
          // },
          // "& .slick-list": {
          //   margin: "0 -32px",
          // },
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
          {ITEMS.map(({ title, image, id, hideBoxShadow }) => (
            <Box
              key={id}
              sx={{
                px: 2,
              }}
            >
              <Typography sx={{ textAlign: "left", mb: 1.5 }}>
                {title}
              </Typography>
              <Box
                component="img"
                sx={{
                  display: "block",
                  width: "100%",
                  boxShadow: hideBoxShadow ? 0 : 2,
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

      <Box sx={{ textAlign: "center", width: { md: "40%" }, maxWidth: 540 }}>
        <Button variant="secondary" startIcon={<BlockHubIcon />}>
          Explore all Blocks
        </Button>
        <Spacer height={4} />
        <Box>
          Anyone can build new blocks and submit them to the registry. If you
          can’t see the block type you want,{" "}
          <Link href="/docs/developing-blocks">start building it today.</Link>
        </Box>
      </Box>
    </Box>
  );
};
