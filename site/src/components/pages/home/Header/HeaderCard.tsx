import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";
import { HeaderCardSvg } from "./HeaderCardSvg";

export const HeaderCard = () => {
  useEffect(() => {
    // return
    const tl = gsap
      .timeline({ repeat: -1 })
      .to(
        [
          "#person",
          "#image",
          "#image_circle",
          "#jobTitle",
          "#jobTitle_circle",
          "#card_circle",
          "#issue",
          "#issue_circle",
        ],
        {
          autoAlpha: 0,
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
      .to(["#jobTitle_circle", "#jobTitle_circle_inner"], {
        autoAlpha: 1,
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
      .to(["#image_circle", "#image_circle_inner"], {
        autoAlpha: 1,
      })
      .to(["#card_circle"], {
        autoAlpha: 0.4,
      })
      .to(["#image_circle"], {
        autoAlpha: 0.5,
      })
      .to(["#issue_circle"], {
        autoAlpha: 1,
      })
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
