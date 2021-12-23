import { VFC } from "react";
import { Typography, Box } from "@mui/material";
import { Carousel } from "./Carousel";
import { Link } from "./Link";
import { BlockMetadata } from "../pages/api/blocks.api";

type BlockSliderProps = {
  catalog: BlockMetadata[];
};

export const BlocksSlider: VFC<BlockSliderProps> = ({ catalog }) => {
  return (
    <Carousel
      sx={{
        backgroundColor: ({ palette }) => palette.gray[20],
      }}
      data={catalog}
      itemKey={({ name }) => name}
      renderItem={({ displayName, name, image, packagePath }) => {
        return (
          <Link href={packagePath}>
            <Box
              key={name}
              sx={{
                px: 2,
                maxWidth: 500,
                mx: "auto",
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
                  boxShadow: 1,
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
