import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Box, BoxProps, useMediaQuery, useTheme } from "@mui/material";
import {
  Fragment,
  FunctionComponent,
  ReactElement,
  useMemo,
  useRef,
} from "react";
import Slider, { Settings } from "react-slick";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type CarouselProps<T> = {
  data: T[];
  renderItem(item: T): ReactElement;
  itemKey(option: T): string;
  edgeBackground?: { left: string; right: string };
  settings?: Partial<Settings>;
  sx?: BoxProps["sx"];
  "data-testid"?: string;
};

type ArrowProps = {
  className?: string;
  onClick?: () => void;
  arrowType: "prev" | "next";
};

const Arrow: FunctionComponent<ArrowProps> = ({
  className,
  onClick,
  arrowType,
}) => {
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
            color: ({ palette }) => palette.gray[50],
          }}
        />
      ) : (
        <ArrowRightIcon
          sx={{
            width: 24,
            height: 24,
            color: ({ palette }) => palette.gray[50],
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
  edgeBackground,
  sx = [],
  ...props
}: CarouselProps<T>): ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const slider = useRef<Slider>(null);

  const sliderSettings = useMemo(
    () =>
      ({
        infinite: false,
        slidesToShow: isMobile ? 1 : 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        initialSlide: 0,
        variableWidth: true,
        prevArrow: <Arrow arrowType="prev" />,
        nextArrow: <Arrow arrowType="next" />,
        // eslint-disable-next-line react/no-unstable-nested-components
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
      data-testid={props["data-testid"]}
      sx={[
        {
          overflow: "hidden",
          width: "100%",
          position: "relative",
          zIndex: 2,
          py: 4,

          // this gives the carousel an initial left padding to match the design
          "& .slick-track": {
            marginLeft: {
              xs: 0,
              lg: "4rem",
              xl: "12rem",
            },
            display: "flex",
          },

          // this group of styles ensures consistent item height, which aligns focus outlines
          "& .slick-list": {
            display: { xs: "block", md: "flex" },
            flexDirection: "row",
            margin: "-10px 0 10px",
            padding: "10px 0",
          },
          "& .slick-slide, & .slick-slide > div": {
            display: { xs: "block", md: "flex" },
          },
          ".slick-slide": {
            minWidth: { xs: "unset", md: "350px" },
            maxWidth: { xs: "280px", md: "unset" },
            mx: 1,
          },

          "& .slick-dots": {
            position: "relative",
            bottom: "unset",
            li: {
              margin: "0 3px",
            },
            "li div": {
              backgroundColor: ({ palette }) => palette.gray[30],
              transition: "all 0.3s ease",
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
              top: "-30%",
              bottom: "-30%",
              left: 0,
              width: 150,
              zIndex: 2,
              ...(edgeBackground
                ? { background: edgeBackground.left }
                : {
                    background: `linear-gradient(88.02deg, rgba(247, 250, 252, 0.952) 0%, rgba(247, 250, 252, 0) 40%)`,
                  }),
            },
            ":after": {
              display: { xs: "none", md: "block" },
              content: `""`,
              position: "absolute",
              top: "-30%",
              bottom: "-30%", // temp fix for https://github.com/blockprotocol/blockprotocol/pull/42#discussion_r774474152
              right: 0,
              width: 150,
              zIndex: 2,
              ...(edgeBackground
                ? { background: edgeBackground.right }
                : {
                    background: `linear-gradient(272.02deg, #F7FAFC 1.67%, rgba(247, 250, 252, 0) 98.26%)`,
                  }),
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
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
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
          <Fragment key={itemKey(item)}>{renderItem(item)}</Fragment>
        ))}
      </Slider>
    </Box>
  );
};
