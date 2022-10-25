import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";

import { ExpandedBlockMetadata as BlockMetadata } from "../lib/blocks.js";
import { Carousel } from "./carousel.js";
import { Link } from "./link.js";

type BlocksSliderProps = {
  catalog: BlockMetadata[];
};

export const BlocksSlider: FunctionComponent<BlocksSliderProps> = ({
  catalog,
}) => {
  return (
    <Carousel
      data-testid="block-slider"
      data={catalog}
      itemKey={({ name }) => name!}
      renderItem={({ displayName, name, image, blockSitePath }) => {
        return (
          <Link
            href={blockSitePath}
            sx={{ display: "block", maxWidth: 500, mx: "auto" }}
          >
            <Box
              key={name}
              sx={{
                px: 3,
              }}
            >
              <Typography sx={{ textAlign: "left", mb: 1.5 }}>
                {displayName}
              </Typography>
              <Box
                component="img"
                sx={{
                  display: "block",
                  width: "100%",
                  borderRadius: "6px",
                  filter: `
                        drop-shadow(0px 2px 8px rgba(39, 50, 86, 0.04))
                        drop-shadow(0px 2.59259px 6.44213px rgba(39, 50, 86, 0.06))
                        drop-shadow(0px 0.5px 1px rgba(39, 50, 86, 0.10))
                      `,
                }}
                src={image ?? "/assets/default-block-img.svg"}
              />
            </Box>
          </Link>
        );
      }}
    />
  );
};
