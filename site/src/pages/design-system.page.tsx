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
    displayName: "Video",
    description: "Play videos of any type or length with rich media controls.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Divider",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Embed",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Table",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Person",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Heading",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Image",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
  },
  {
    displayName: "Paragraph",
    description:
      "Separate content into sections with a subtle horizontal divider.",
    image: "",
    icon: "",
    account: "@hash",
    version: "V2.0.2",
    lastUpdated: "Updated 6 months ago",
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
        <CardContent sx={{ p: 4 }}>
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
            {CARDS.map((card) => (
              <Grid item key={card.displayName}>
                <BlockCard {...card} />
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
