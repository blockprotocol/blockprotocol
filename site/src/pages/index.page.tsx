import { Container, Typography, Box } from "@mui/material";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <>
      <Box
        sx={{ backgroundColor: "#3F4656", height: 500 }}
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
      <Container sx={{ marginTop: (theme) => theme.spacing(12) }}>
        <Typography component="h2" variant="bpHeading2" textAlign="center">
          Embed any block anywhere on the web,
          <br />
          using data from any source
        </Typography>
        <Typography variant="body1" textAlign="center">
          Easily move data between applications without wrestling with APIs and
          custom integrations. View it any way you like in interactive blocks.
        </Typography>
      </Container>
    </>
  );
};

export default HomePage;
