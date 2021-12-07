import { Container, Typography, Box } from "@mui/material";
import { NextPage } from "next";

export const HOME_PAGE_HEADER_HEIGHT = 750;

const HomePage: NextPage = () => {
  return (
    <>
      <Box
        sx={{ backgroundColor: "#3F4656", height: HOME_PAGE_HEADER_HEIGHT }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h1"
          sx={{ color: (theme) => theme.palette.common.white }}
        >
          [Header]
        </Typography>
      </Box>
      <Container sx={{ marginTop: 12 }}>
        <Typography component="h2" variant="bpHeading2" textAlign="center">
          Embed any block anywhere on the web,
          <br />
          using data from any source
        </Typography>
        <Typography variant="body1" textAlign="center">
          Easily move data between applications without wrestling with APIs and
          custom integrations. View it any way you like in interactive blocks.
        </Typography>
        {/* Temporarily add lots of lines to test Navbar on-scroll behaviour */}
        {Array.from(Array(1000).keys()).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Typography key={i}>Block #{i}</Typography>
        ))}
      </Container>
    </>
  );
};

export default HomePage;
