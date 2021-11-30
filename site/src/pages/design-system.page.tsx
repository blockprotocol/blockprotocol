import {
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Icon,
  useTheme,
  Box,
} from "@mui/material";
import React from "react";
import { Button } from "../components/Button";
import { InlineLink } from "../components/InlineLink";

const DesignSystem = () => {
  const theme = useTheme();

  console.log("theme ==> ", theme);

  return (
    <Container>
      <Typography variant="bpHeading1">Typography</Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
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
        <CardContent sx={{ p: 4 }}>
          {/* <Stack direction="column"> */}
          <Button
            variant="primary"
            sx={{ mr: 2 }}
            startIcon={<Icon className="fa-plus-circle" />}
          >
            Read the Quickstart Guide
          </Button>
          <Button variant="secondary" sx={{ mr: 2 }}>
            Read the Spec
          </Button>
          <br />
          <br />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <InlineLink
              popperInfo={{
                title: "Schema",
                content:
                  "A schema is a structure that defines the properties and types of an entity",
              }}
            >
              Links
            </InlineLink>
          </Box>
          {/* </Stack> */}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DesignSystem;
