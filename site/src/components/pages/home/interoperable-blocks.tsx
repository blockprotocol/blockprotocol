import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

import transparentBlocksWithCircleImage from "../../../../public/assets/new-home/transparent-blocks-with-circle-min.png";

export const InteroperableBlocks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background:
          "radial-gradient(133.26% 109.17% at 71.86% 0%, #F2EFF5 0%, #FFFFFF 70.54%)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          top: 0,
          right: 0,
          display: { xs: "flex", md: "block" },
          flexDirection: {
            xs: "column-reverse",
            sm: "row-reverse",
            md: "unset",
          },
          gridGap: { xs: "1rem", md: 0 },
          alignItems: { xs: "flex-end", sm: "unset" },
          height: { md: "85vh", lg: "100vh", xl: "105vh" },
          marginLeft: { xs: "0", md: "-12rem", lg: "-8rem", xl: "1rem" },
          padding: { xs: "2rem 0 1rem 1rem", sm: "4rem 0 4rem 2rem", md: 0 },
        }}
      >
        {isMobile ? (
          <Box
            sx={{
              position: "relative",
              width: { xs: "80%", sm: "40%" },
              height: "50%",
              zIndex: "3",
            }}
            component="img"
            src="/assets/new-home/transparent-blocks-mobile.png"
          />
        ) : (
          <Box
            sx={{
              position: { sm: "relative", md: "absolute" },
              right: 0,
              top: 0,
              width: { md: "100%", lg: "95%", xl: "90%" },
              zIndex: "3",
            }}
          >
            <Image src={transparentBlocksWithCircleImage} />
          </Box>
        )}

        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            top: { md: "8%", lg: "10%", xl: "12%" },
            right: { md: "16%", lg: "18%", xl: "22%" },
            maxWidth: { xs: "100%", sm: "100%", md: "49ch" },
            flexShrink: 1,
          }}
        >
          <Typography
            variant="bpHeading1"
            textAlign="left"
            mt={4}
            sx={{
              lineHeight: 1,
              color: ({ palette }) => palette.gray[90],
              mb: 3,
            }}
          >
            Block Protocol blocks
            <br /> are <span style={{ color: "#8b4cea" }}>interoperable</span>
          </Typography>
          <Box
            sx={{
              width: "120px",
              height: "2px",
              ml: "0.25rem",
              my: 3,
              background:
                "linear-gradient(to right, rgb(149, 135, 239, 1), rgba(172, 159, 255, 0))",
            }}
          />
          <Typography variant="bpBodyCopy" textAlign="left" mb={1}>
            Blocks that adhere to the Block Protocol can work in any application
            which also uses the protocol, without any extra configuration.
          </Typography>
          <Typography variant="bpBodyCopy" textAlign="left" mr={6}>
            Any developer can build a world-class block for others to use.
            Blocks can solve specific user needs that individual application
            developers don’t have the time or expertise to build.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
