import { Container, Typography } from "@mui/material";
import { NextPage } from "next";
import { tw } from "twind";

import { Button } from "../../components/button";

const PartnersSubmitted: NextPage = () => {
  return (
    <Container
      sx={{
        marginTop: {
          xs: 4,
          md: 8,
        },
        marginBottom: {
          xs: 4,
          md: 8,
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography mb={2} variant="bpTitle">
        Thanks for registering
      </Typography>
      <Typography mb={4} variant="bpSubtitle">
        We’ve received your submission and will be in touch.
      </Typography>

      <Button onClick={() => window.history.go(-2)} squared>
        Go back{" "}
        <img
          className={tw`ml-2 inline`}
          alt="return"
          src="/assets/keyboard-return.svg"
        />
      </Button>
    </Container>
  );
};

export default PartnersSubmitted;
