import React, { useEffect, VFC } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { HeaderCardSvg } from "./HeaderCardSvg";

type HeaderCardProps = {
  hideGradient: boolean;
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
        {
          attr: {
            r: 0,
            opacity: 1,
          },
        },
      )
      .to("#person", {
        autoAlpha: 1,
      })
      .from("#person__card", {
        attr: {
          x2: (_, target) => target.getAttribute("x1"),
          y2: (_, target) => target.getAttribute("y1"),
        },
      })
      .to(["#jobTitle", "#image", "#fullName"], {
        autoAlpha: 1,
      })
      .from("#person__fullName", {
        attr: {
          x2: (_, target) => target.getAttribute("x1"),
          y2: (_, target) => target.getAttribute("y1"),
        },
      })
      .from(["#fullName_circle_inner", "#fullName_circle_outer"], {
        attr: {
          r: 0,
          opacity: 1,
        },
      })
      .to(["#card_title"], {
        fill: "#6048E5",
      })
      .from("#person__jobTitle", {
        attr: {
          x2: (_, target) => target.getAttribute("x1"),
          y2: (_, target) => target.getAttribute("y1"),
        },
      })
      .from(["#jobTitle_circle_inner", "#jobTitle_circle_outer"], {
        attr: {
          r: 0,
          opacity: 1,
        },
      })
      .to(["#card_subtitle"], {
        fill: "#6048E5",
      })
      .to(["#jobTitle_circle"], {
        autoAlpha: 0.5,
      })
      .from("#person__image", {
        attr: {
          x2: (_, target) => target.getAttribute("x1"),
          y2: (_, target) => target.getAttribute("y1"),
        },
      })
      .from(["#image_circle_inner", "#image_circle_outer"], {
        attr: {
          r: 0,
          opacity: 1,
        },
      })
      .from("#card_circle", {
        attr: {
          r: 0,
          opacity: 1,
        },
      })
      .to(["#image_circle"], {
        autoAlpha: 0.5,
      })
      .from(
        ["#issue_circle_inner", "#issue_circle_outer", "#issue_circle_outer2"],
        {
          attr: {
            r: 0,
            opacity: 1,
          },
        },
      )
      .to(["#issue"], {
        autoAlpha: 0.92,
      })
      .from("#issue__card", {
        attr: {
          x2: (_, target) => target.getAttribute("x1"),
          y2: (_, target) => target.getAttribute("y1"),
        },
      });

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
