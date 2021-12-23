import React, { useMemo, useRef, VFC, ReactElement } from "react";
import { Box, useTheme, useMediaQuery, BoxProps } from "@mui/material";
import Slider, { Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { ArrowLeftIcon } from "./SvgIcon/ArrowLeft";
import { ArrowRightIcon } from "./SvgIcon/ArrowRight";

type CarouselProps<T> = {
  data: T[];
  renderItem(item: T): ReactElement;
  itemKey(option: T): string;
  edgeFadeColor?: string;
  settings?: Partial<Settings>;
} & BoxProps;

type ArrowProps = {
  className?: string;
  onClick?: () => void;
  arrowType: "prev" | "next";
};

const Arrow: VFC<ArrowProps> = ({ className, onClick, arrowType }) => {
  return (
    <Box
      className={className}
      sx={{
        height: 44,
        width: 44,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white !important",
        cursor: "pointer",
        boxShadow: 1,
        ":hover": {
          boxShadow: 2,
        },
      }}
      onClick={onClick}
    >
      {arrowType === "prev" ? (
        <ArrowLeftIcon
          sx={{
            width: 24,
            height: 24,
          }}
        />
      ) : (
        <ArrowRightIcon
          sx={{
            width: 24,
            height: 24,
          }}
        />
      )}
    </Box>
  );
};

export const Carousel = <T,>({
  data,
  renderItem,
  itemKey,
  settings = {},
  edgeFadeColor,
  ...boxProps
}: CarouselProps<T>): ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const slider = useRef<Slider>();
  const { sx, ...otherBoxProps } = boxProps;

  const sliderSettings = useMemo(
    () =>
      ({
        infinite: false,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        initialSlide: 0,
        prevArrow: <Arrow arrowType="prev" />,
        nextArrow: <Arrow arrowType="next" />,
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
        ...settings,
      } as Settings),
    [isMobile, settings],
  );

  return (
    <Box
      {...otherBoxProps}
      sx={{
        overflow: "hidden",
        width: "100%",
        position: "relative",
        zIndex: 2,

        pt: { xs: 4, md: 8 },
        pb: { xs: 8, md: 8 },

        // this gives the carousel an initial left padding to match the design
        "& .slick-track": {
          paddingLeft: { xs: 0, md: "8%" },
          display: "flex",
        },

        "& .slick-dots": {
          bottom: "unset",
          top: "105%",
          "li div": {
            backgroundColor: ({ palette }) => palette.gray[30],
          },
          "li.slick-active div": {
            backgroundColor: ({ palette }) => palette.purple[700],
          },
        },

        // this is responsible for the fade effect on the left/right of the carousel
        "& .slick-slider.slick-initialized": {
          ":before": {
            display: { xs: "none", md: "block" },
            content: `""`,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 200,
            zIndex: 2,
            background: `linear-gradient(to right, ${
              edgeFadeColor || "#F7FAFC"
            } 1.9%, transparent 80%)`,
          },
          ":after": {
            display: { xs: "none", md: "block" },
            content: `""`,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: 200,
            zIndex: 2,
            background: `linear-gradient(to left, ${
              edgeFadeColor || "#F7FAFC"
            } 1.9%, transparent 80%)`,
          },
        },

        "& .slick-arrow": {
          position: "absolute",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,

          "&:before": {
            display: "none",
          },

          "&.slick-disabled": {
            display: "none",
          },

          "&.slick-prev": {
            left: 36,
          },
          "&.slick-next": {
            right: 36,
          },
        },
        ...sx,
      }}
    >
      <Slider
        ref={(node) => {
          if (node) {
            slider.current = node;
          }
        }}
        {...sliderSettings}
      >
        {data.map((item) => (
          <React.Fragment key={itemKey(item)}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </Slider>
    </Box>
  );
};
