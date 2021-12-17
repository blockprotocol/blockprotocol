import {
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
  Icon,
  Box,
  Grid,
} from "@mui/material";
import React from "react";
import { Button } from "../components/Button";
import { InlineLink } from "../components/InlineLink";
import { BlockCard, BlockCardComingSoon } from "../components/BlockCard";
import { Spacer } from "../components/Spacer";

const CARDS = [
  {
    name: "@hashintel/block-code",
    version: "0.1.0",
    description: "Capture a code snippet",
    author: "teenoh",
    license: "MIT",
    schema: "block-schema.json",
    displayName: "Code",
    packagePath: "@hash/code",
    icon: "public/code.svg",
    timestamp: "2021-12-06T19:26:02.552Z",
  },
  {
    name: "@hashintel/block-table",
    version: "0.1.0",
    description: "Create a table for storing information in rows and columns",
    author: "Ciaran Morinan",
    license: "MIT",
    schema: "block-schema.json",
    displayName: "Table",
    packagePath: "@hash/table",
    icon: "public/table.svg",
    timestamp: "2021-12-06T19:26:02.552Z",
  },
  {
    name: "@hashintel/block-embed",
    version: "0.1.0",
    description: "Embed external content",
    author: "hashintel",
    license: "MIT",
    displayName: "Embed",
    packagePath: "@hash/embed",
    icon: "public/embed.svg",
    schema: "block-schema.json",
    timestamp: "2021-12-06T19:26:02.552Z",
  },
];

const DesignSystem = () => {
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
        <CardContent
          sx={{
            p: 4,
          }}
        >
          {(["small", "medium"] as const).map((size) =>
            (["purple", "teal", "gray", "warning", "danger"] as const).map(
              (color) => (
                <Box key={color} mb={1} sx={{ "> button": { mr: 2 } }}>
                  <Typography variant="bpBodyCopy">
                    {color} {size}
                  </Typography>
                  <Button
                    variant="primary"
                    color={color}
                    startIcon={<Icon className="fa-plus-circle" />}
                    size={size}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="primary"
                    color={color}
                    squared
                    startIcon={<Icon className="fa-plus-circle" />}
                    size={size}
                  >
                    Primary Button Squared
                  </Button>
                  <Button
                    variant="secondary"
                    color={color}
                    startIcon={<Icon className="fa-plus-circle" />}
                    size={size}
                  >
                    Secondary Button
                  </Button>
                  <Button
                    variant="secondary"
                    color={color}
                    squared
                    startIcon={<Icon className="fa-plus-circle" />}
                    size={size}
                  >
                    Secondary Button squared
                  </Button>
                  <Button
                    variant="tertiary"
                    color={color}
                    squared
                    startIcon={<Icon className="fa-plus-circle" />}
                    size={size}
                  >
                    Tertiary Button squared
                  </Button>
                </Box>
              ),
            ),
          )}
          <br />
          <br />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <InlineLink
              href="/"
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
            {CARDS.map((card) => (
              <Grid item key={card.displayName}>
                <BlockCard data={card} />
              </Grid>
            ))}
            <Grid item>
              <BlockCardComingSoon />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Spacer height={5} />
    </Container>
  );
};

export default DesignSystem;
