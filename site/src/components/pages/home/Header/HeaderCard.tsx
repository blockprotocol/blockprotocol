import React, { useEffect, VFC } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { HeaderCardSvg } from "./HeaderCardSvg";

type HeaderCardProps = {
  hideGradient: boolean;
};

const circleAnimationProps = {
  attr: {
    r: 0,
    opacity: 1,
  } as gsap.AttrVars,
};

const lineDrawAnimationProps = {
  attr: {
    x2: (_, target: HTMLElement) => target.getAttribute("x1"),
    y2: (_, target: HTMLElement) => target.getAttribute("y1"),
  } as gsap.AttrVars,
};

export const HeaderCard: VFC<HeaderCardProps> = ({ hideGradient }) => {
  useEffect(() => {
    const tl = gsap
      .timeline({ repeat: -1 })
      .to(["#person", "#image", "#jobTitle", "#fullName", "#issue"], {
        autoAlpha: 0,
      })
      .from(
        [
          "#person_concentric_1",
          "#person_concentric_2",
          "#person_concentric_3",
        ],
        circleAnimationProps,
      )
      .to("#person", {
        autoAlpha: 1,
      })
      .from("#person__card", lineDrawAnimationProps)
      .to(["#jobTitle", "#image", "#fullName"], {
        autoAlpha: 1,
      })
      .from("#person__fullName", lineDrawAnimationProps)
      .from(
        ["#fullName_circle_inner", "#fullName_circle_outer"],
        circleAnimationProps,
      )
      .to(["#card_title"], {
        fill: "#6048E5",
      })
      .from("#person__jobTitle", lineDrawAnimationProps)
      .from(
        ["#jobTitle_circle_inner", "#jobTitle_circle_outer"],
        circleAnimationProps,
      )
      .to(["#card_subtitle"], {
        fill: "#6048E5",
      })
      .to(["#jobTitle_circle"], {
        autoAlpha: 0.5,
      })
      .from("#person__image", lineDrawAnimationProps)
      .from(
        ["#image_circle_inner", "#image_circle_outer"],
        circleAnimationProps,
      )
      .from("#card_circle", circleAnimationProps)
      .to(["#image_circle"], {
        autoAlpha: 0.5,
      })
      .from(
        ["#issue_circle_inner", "#issue_circle_outer", "#issue_circle_outer2"],
        circleAnimationProps,
      )
      .to(["#issue"], {
        autoAlpha: 0.92,
      })
      .from("#issue__card", lineDrawAnimationProps);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <HeaderCardSvg hideGradient={hideGradient} />
    </Box>
  );
};
