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
      .timeline({ repeat: -1, repeatDelay: 2 })
      .to(
        [
          "#hcard_person",
          "#hcard_image",
          "#hcard_jobTitle",
          "#hcard_fullName",
          "#hcard_issue",
        ],
        {
          autoAlpha: 0,
        },
      )
      .from(
        [
          "#hcard_person_circle_outer3",
          "#hcard_person_circle_outer2",
          "#hcard_person_circle_outer",
        ],
        { ...circleAnimationProps, duration: 2 },
      )
      .to(
        "#hcard_person",
        {
          autoAlpha: 1,
          duration: 2,
        },
        "<",
      )
      .from("#hcard_person__card", lineDrawAnimationProps)
      .to(["#hcard_jobTitle", "#hcard_image", "#hcard_fullName"], {
        autoAlpha: 1,
      })
      .from("#hcard_person__fullName", lineDrawAnimationProps)
      .from(
        ["#hcard_fullName_circle_inner", "#hcard_fullName_circle_outer"],
        circleAnimationProps,
      )
      .to(
        ["#card_title"],
        {
          fill: "#6048E5",
        },
        "<",
      )
      .to(["#hcard_fullName_circle"], {
        autoAlpha: 0.5,
      })
      .from("#hcard_person__jobTitle", lineDrawAnimationProps, "<")
      .from(
        ["#hcard_jobTitle_circle_inner", "#hcard_jobTitle_circle_outer"],
        circleAnimationProps,
      )
      .to(
        ["#card_subtitle"],
        {
          fill: "#6048E5",
        },
        "<",
      )
      .to(["#hcard_jobTitle_circle"], {
        autoAlpha: 0.5,
      })
      .from("#hcard_person__image", lineDrawAnimationProps, "<")
      .from(
        ["#hcard_image_circle_inner", "#hcard_image_circle_outer"],
        circleAnimationProps,
      )
      .from("#card_circle", circleAnimationProps, "<")
      .to(["#hcard_image_circle"], {
        autoAlpha: 0.5,
      })
      .from(
        [
          "#hcard_issue_circle_inner",
          "#hcard_issue_circle_outer",
          "#hcard_issue_circle_outer2",
        ],
        circleAnimationProps,
        "<",
      )
      .to(["#hcard_issue"], {
        autoAlpha: 0.92,
      })
      .from("#hcard_issue__card", lineDrawAnimationProps)
      .to(
        "#hcard_card-issue",
        {
          stroke: "#6048E5",
        },
        "<0.5",
      );

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
