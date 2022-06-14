import { Box, Typography } from "@mui/material";

export const InteroperableBlocks = () => {
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
          height: { md: "85vh", lg: "105vh", xl: "106vh" },
          marginLeft: { md: "-10rem", lg: "-6rem", xl: "1rem" },
        }}
      >
        <Box
          sx={{
            position: { sm: "relative", md: "absolute" },
            right: 0,
            top: 0,
            width: { md: "100%", lg: "95%", xl: "90%" },
            zIndex: "3",
          }}
          component="img"
          src="/assets/new-home/transparent-blocks-with-circle.png"
        />
        {/* <Box
          sx={{
            position: "relative",
            top: "-20rem",
            width: "100%",
            zIndex: "2",
            transform: "rotate(180deg)",
          }}
          component="img"
          src="/assets/new-home/small-helix.png"
        /> */}
        <Box
          sx={{
            position: { sm: "relative", md: "absolute" },
            top: { md: "8%", lg: "10%", xl: "12%" },
            right: { md: "16%", lg: "18%", xl: "22%" },
            maxWidth: { md: "49ch" },
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
            which also uses the protocol. Without any extra configuration.
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
