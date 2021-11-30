import { Typography, Container, Card, CardContent, Stack, Icon } from "@mui/material";
import React from "react";
import { Button } from "../components/Button";
import { InlineLink } from "../components/InlineLink";

const DesignSystem = () => {
  return (
    <Container>
      <Typography variant="bpHeading1">Typography</Typography>
      <Card>
        <CardContent>
          <Stack>
            <Typography variant="bpHeading1">Heading</Typography>
            <Typography variant="bpHeading2">Heading</Typography>
            <Typography variant="bpHeading3">Heading</Typography>
            <Typography variant="bpLargeText">Heading</Typography>
            <Typography variant="bpBodyCopy">Heading</Typography>
            <Typography variant="bpSmallCopy">Heading</Typography>
            <Typography variant="bpMicroCopy">Heading</Typography>
          </Stack>
        </CardContent>
      </Card>
      <Typography variant="bpHeading1">Button</Typography>
      <Card>
        <CardContent>
          {/* <Stack direction="column"> */}
            <Button variant="primary" sx={{ mr: 2 }} 
            startIcon={<Icon className="fa-plus-circle" />}
            >Read the Quickstart Guide</Button>
            <Button variant="secondary" sx={{ mr: 2 }}>Read the Spec</Button>
            <br />
            <br />
            <InlineLink></InlineLink>
          {/* </Stack> */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DesignSystem;
