import {
  Box,
  BoxProps,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useRef, VoidFunctionComponent } from "react";
import Slider, { Settings } from "react-slick";
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

export const BlocksSlider: VoidFunctionComponent<BoxProps> = ({
  ...boxProps
}) => {
  const slider = useRef<Slider>();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        backgroundColor: ({ palette }) => palette.gray[20],
        overflow: "hidden",

        width: "100%",
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
        ...boxProps.sx,
      }}
      {...boxProps}
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
            <Typography sx={{ textAlign: "left", mb: 1.5 }}>{title}</Typography>
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
  );
};
