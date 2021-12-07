import { Container, Typography } from "@mui/material";
import { NextPage } from "next";

const HubPage: NextPage = () => {
  return (
    <Container>
      <Typography component="h1" variant="bpHeading1">
        Block Hub
      </Typography>
      {/* Temporarily add lots of lines to test Navbar on-scroll behaviour */}
      {Array.from(Array(1000).keys()).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography key={i}>Block #{i}</Typography>
      ))}
    </Container>
  );
};

export default HubPage;
