import {
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Icon,
  useTheme,
  Box,
  Grid,
} from "@mui/material";
import React from "react";
import { Button } from "../components/Button";
import { InlineLink } from "../components/InlineLink";
import { BlockCard } from "../components/BlockCard";
import { Spacer } from "../components/Spacer"

const DesignSystem = () => {
  const theme = useTheme();

  console.log("theme ==> ", theme);

  return (
    <Container>
      <Typography variant="bpHeading2">Typography</Typography>
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
      <Spacer height={5} />
      <Typography variant="bpHeading2">Button</Typography>
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
        </CardContent>
      </Card>
      <Spacer height={5} />
      <Typography variant="bpHeading2">Card Preview</Typography>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {[1,2,3,4,5,6,7].map((item) => (
              <Grid item>
                <BlockCard blockName="Video"  />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DesignSystem;
