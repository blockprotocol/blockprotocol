import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/legacy/image";

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
          marginLeft: { xs: "0", md: "-12rem", lg: "-8rem", xl: "1rem" },
          padding: { xs: "2rem 1rem 1rem 1rem", sm: "4rem 0 4rem 2rem", md: 0 },
        }}
      >
        {isMobile ? (
          <Box
            sx={{
              position: "relative",
              width: { xs: "80%", sm: "40%" },
              height: "50%",
              zIndex: "3",
              marginRight: { xs: "-1rem", sm: 0 },
            }}
            component="img"
            src="/assets/new-home/transparent-blocks-mobile.png"
          />
        ) : (
          <Box
            sx={{
              position: "relative",
              top: 0,
              width: { md: "145%", lg: "120%", xl: "95%" },
              left: { lg: "-7.5%", xl: "5%" },
              zIndex: "3",
            }}
          >
            <Image src={transparentBlocksWithCircleImage} />
          </Box>
        )}

        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            top: { md: "4%", lg: "8%", xl: "10%" },
            right: { md: "8%", lg: "18%", xl: "26%" },
            maxWidth: { xs: "100%", sm: "100%", md: "49ch" },
            flexShrink: 1,
            zIndex: 3,
          }}
        >
          <Typography
            variant="bpHeading3"
            textAlign="left"
            mt={4}
            sx={{
              fontWeight: 500,
              mb: 1.75,
              letterSpacing: "-0.01em",
              color: ({ palette }) => palette.gray[90],
              lineHeight: 1.2,
            }}
          >
            Block Protocol blocks
            <br /> are{" "}
            <Box
              component="span"
              sx={{ color: ({ palette }) => palette.purple[70] }}
            >
              interoperable
            </Box>
          </Typography>

          <Box
            sx={{
              width: 74,
              height: 3,
              background:
                "linear-gradient(90deg, rgba(117, 86, 220, 0.8) 0%, rgba(117, 86, 220, 0) 100%)",
              borderRadius: 6,
              mb: 3,
            }}
          />

          <Typography variant="bpBodyCopy" sx={{ textAlign: "left", mb: 1.5 }}>
            <strong>No extra configuration required:</strong> blocks that adhere
            to the Block Protocol work out the box in any application which also
            uses the protocol.
          </Typography>

          <Typography variant="bpBodyCopy" sx={{ textAlign: "left", mb: 1.5 }}>
            <strong>Available for instant use ecosystem-wide:</strong> any
            developer can build a world-class block for themselves or others to
            enjoy.
          </Typography>

          <Typography variant="bpBodyCopy" sx={{ textAlign: "left", mb: 1.5 }}>
            <strong>Specialized blocks everywhere:</strong> blocks can solve
            specific user needs that individual application developers don’t
            have the time, awareness or expertise to build.
          </Typography>

          <Typography variant="bpBodyCopy" sx={{ textAlign: "left", mb: 1.5 }}>
            <strong>Convergence on semantic data structures:</strong> blocks
            make it easy to capture and work with typed data - often even more
            convenient than inputting information in an unstructured fashion.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
