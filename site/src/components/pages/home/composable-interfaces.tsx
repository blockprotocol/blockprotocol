import { Box, Typography } from "@mui/material";
import Image from "next/image";

import composableFullImage from "../../../../public/assets/new-home/composable-full-min.png";

export const ComposableInterfaces = () => {
  return (
    <Box
      sx={{
        background:
          "radial-gradient(116.02% 95.04% at 50% 100.79%, #F3F0F9 0%, #FFFFFF 70.54%);",
        mt: 2,
        pb: { xs: 5, sm: 8 },
        borderBottom: `1px solid #eceaf1`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          margin: { xs: "0 auto 2rem", lg: "0 auto" },
          maxWidth: { xs: "100%", md: "700px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography variant="bpHeading2" textAlign="center" my={2}>
          The Block Protocol makes building composable interfaces easy
        </Typography>
        <Box
          sx={{
            width: "160px",
            height: "2px",
            my: 1.5,
            background:
              "linear-gradient(to right, rgb(149, 135, 239, 1), rgba(172, 159, 255, 0))",
          }}
        />
        <Typography
          variant="bpBodyCopy"
          textAlign="center"
          sx={{
            color: ({ palette }) => palette.gray[80],
            maxWidth: "46ch",
            margin: "1rem auto 1rem",
          }}
        >
          Applications that follow the protocol can use any Block Protocol block
          with zero marginal implementation cost.
        </Typography>
        <Typography
          variant="bpBodyCopy"
          textAlign="center"
          sx={{
            color: ({ palette }) => palette.gray[80],
            maxWidth: "46ch",
            margin: "0 auto",
          }}
        >
          This means you can give users access to a wide variety of blocks – far
          more than you could build yourself. Empower users to build their own
          modular interfaces and solutions to complex problems.
        </Typography>
      </Box>
      <Box
        sx={{
          alignItems: "center",
          position: "relative",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: { xs: "180%", sm: "100%" },
          marginLeft: { xs: "-40%", sm: 0 },
        }}
      >
        <Image src={composableFullImage} />
      </Box>
    </Box>
  );
};
