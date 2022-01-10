import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { HeaderCardSvg } from "./HeaderCardSvg";

export const HeaderCard = () => {
  useEffect(() => {
    // return
    const tl = gsap
      .timeline({ repeat: -1 })
      .to(["#person", "#image", "#jobTitle", "#card_circle", "#issue"], {
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
          x2: (_, target) => target.dataset.x1,
          y2: (_, target) => target.dataset.y1,
        },
      })
      .to(["#card_title"], {
        fill: "#6048E5",
      })
      .to(["#jobTitle", "#image"], {
        autoAlpha: 1,
      })
      .from("#person__jobTitle", {
        attr: {
          x2: (_, target) => target.dataset.x1,
          y2: (_, target) => target.dataset.y1,
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
          x2: (_, target) => target.dataset.x1,
          y2: (_, target) => target.dataset.y1,
        },
      })
      .from(["#image_circle_inner", "#image_circle_outer"], {
        attr: {
          r: 0,
          opacity: 1,
        },
      })
      .to(["#card_circle"], {
        autoAlpha: 0.4,
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
          x2: (_, target) => target.dataset.x1,
          y2: (_, target) => target.dataset.y1,
        },
      });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <HeaderCardSvg />
    </Box>
  );
};
