import { VFC } from "react";
import { Typography, Box } from "@mui/material";
import { Carousel } from "./Carousel";
import { Link } from "./Link";
import { BlockMetadata } from "../pages/api/blocks.api";

type BlocksSliderProps = {
  catalog: BlockMetadata[];
};

export const BlocksSlider: VFC<BlocksSliderProps> = ({ catalog }) => {
  return (
    <Carousel
      sx={{
        backgroundColor: ({ palette }) => palette.gray[20],
      }}
      data={catalog}
      itemKey={({ name }) => name}
      renderItem={({ displayName, name, image, packagePath }) => {
        return (
          <Link
            href={`/${packagePath}`}
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
                src={image}
              />
            </Box>
          </Link>
        );
      }}
    />
  );
};
