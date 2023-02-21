import { faSlack } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronRight,
  faCode,
  faImage,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  BoxProps,
  Container,
  Grid,
  List,
  Stack,
  TableCell,
  TableCellProps,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/legacy/image";
import { FunctionComponent, ReactNode } from "react";

import circleBackground from "../../../../public/assets/pricing/circle-background.png";
import { theme } from "../../../theme";
import { FontAwesomeIcon } from "../../icons";
import { AbstractAiIcon } from "../../icons/abstract-ai-icon";
import { CircleInfoRegularIcon } from "../../icons/circle-info-regular";
import { MapboxLogoIcon } from "../../icons/mapbox-logo-icon";
import { faEnvelope } from "../../icons/pro/fa-envelope";
import { faHammer } from "../../icons/pro/fa-hammer";
import { faImagePolaroid } from "../../icons/pro/fa-image-polaroid";
import { faLocationCrosshairs } from "../../icons/pro/fa-location";
import { faLocationArrow } from "../../icons/pro/fa-location-arrow";
import { faLocationPin } from "../../icons/pro/fa-location-pin";
import { faMap } from "../../icons/pro/fa-map";
import { faText } from "../../icons/pro/fa-text";
import { Link } from "../../link";
import { Table } from "../../table";
import { CustomLink } from "./custom-link";
import { CustomLinkButton } from "./custom-link-button";
import { GradientFontAwesomeIcon } from "./gradient-fontawesome-icon";

const Section: FunctionComponent<
  { sectionName: string; fullWidth?: boolean } & BoxProps
> = ({ sectionName, fullWidth, children }) => {
  return (
    <Grid
      item
      sx={({ breakpoints }) => ({
        gridArea: sectionName,
        [breakpoints.down("lg")]: {
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          pb: 2.5,
          mb: -2.5,
        },
      })}
    >
      <Stack
        sx={({ palette }) => ({
          ...(fullWidth ? { width: 1 } : {}),
          background: `${palette.common.white}80`,
          border: `1px solid ${palette.gray[20]}`,
          backdropFilter: "blur(7.5px)",
          padding: 4.25,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          boxShadow: "0px 4.23704px 8.1px rgb(61 78 133 / 6%)",
        })}
      >
        <Box sx={{ ...(fullWidth ? { width: 1 } : {}), paddingX: 1.5 }}>
          {children}
        </Box>
      </Stack>
    </Grid>
  );
};

const API_USAGE_HEADER = ["Provider", "Service", "Price", "Unit"];

const API_USAGE_ROWS = [
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions.",
    serviceIcon: faImage,
    service: "DALL-E",
    price: "$0.0200",
    unitTooltip: "Corresponds to a single generated image",
    unit: "/image",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "Davinci is the most advanced GPT-3 large language model, providing the highest-quality, longest-length outputs.",
    serviceIcon: faText,
    service: "GPT-3 Davinci",
    price: "$0.0200",
    unitTooltip:
      "Text provided to GPT-3 models is split into tokens. 1,000 tokens equates to roughly 750 words (i.e. approximately 4000 characters) in English",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "Curie is the second-most advanced GPT-3 model, very capable, but faster and lower cost than Davinci.",
    serviceIcon: faText,
    service: "GPT-3 Curie",
    price: "$0.0020",
    unitTooltip:
      "Text provided to GPT-3 models is split into tokens. 1,000 tokens equates to roughly 750 words (i.e. approximately 4000 characters) in English",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "The Babbage GPT-3 model is capable of straightforward tasks, and is both faster and lower cost than Curie.",
    serviceIcon: faText,
    service: "GPT-3 Babbage",
    price: "$0.0005",
    unitTooltip:
      "Text provided to GPT-3 models is split into tokens. 1,000 tokens equates to roughly 750 words (i.e. approximately 4000 characters) in English",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "Ada is the lowest cost GPT-3 model. While being the most basic, it is also generally the fastest.",
    serviceIcon: faText,
    service: "GPT-3 Ada",
    price: "$0.0004",
    unitTooltip:
      "Text provided to GPT-3 models is split into tokens. 1,000 tokens equates to roughly 750 words (i.e. approximately 4000 characters) in English",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "The Mapbox Static Images API serves standalone, static map images. The lowest-cost way to show maps on the web.",
    serviceIcon: faImagePolaroid,
    service: "Static Map Image",
    price: "$0.0010",
    unitTooltip:
      "Corresponds to each image generated for a given location, per zoom-level",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "Address Autofill provides address search and autocomplete functionality. Users can search for an address from a single search bar, then select an address from a list of validated results that dynamically responds to user input. Property values and form fields then automatically populate with the correct address components (e.g., street number, name, suffix, city, state/region, and zip/postcode).",
    serviceIcon: faLocationPin,
    service: "Address Autofill",
    price: "$0.0125",
    unitTooltip:
      "Corresponds to a single autofill session, as determined by Mapbox",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "The Mapbox Isochrone API computes areas that are reachable within a specified amount of time from a location, and returns the reachable regions as contours of polygons or lines that you can display on a map.",
    serviceIcon: faLocationCrosshairs,
    service: "Isochrone",
    price: "$0.0020",
    unitTooltip: "Corresponds to a single lookup from a given location",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "The Mapbox Directions API shows users how to travel between points on a map. It can calculate optimal driving, walking, and cycling routes using traffic- and incident-aware routing; produce turn-by-turn instructions; determine routes with up to 25 coordinates; and calculate routes for electric vehicles to reach destinations with optimal charging stops as well as battery prediction.",
    serviceIcon: faLocationArrow,
    service: "Directions",
    price: "$0.0020",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
        }}
        fill={theme.palette.gray[50]}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "Temporary Geocoding allows users to convert location text into geographic coordinates (e.g. turning `2 Lincoln Memorial Circle NW` into `-77.050,38.889`), as well as the inverse.",
    serviceIcon: faMap,
    service: "Temporary Geocoding",
    price: "$0.00075",
    unitTooltip:
      "Corresponds to a single request to either forward or reverse geocode a location or set of coordinates",
    unit: "/request",
  },
];

const UsageTableHeaderCell: FunctionComponent<TableCellProps> = ({
  children,
  ...props
}) => {
  return (
    <TableCell
      {...props}
      sx={{
        pt: 1.25,
        pb: 0.75,
      }}
    >
      <Typography
        variant="bpSmallCaps"
        sx={{
          color: ({ palette }) => palette.black,
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: "unset",
        }}
      >
        {children}
      </Typography>
    </TableCell>
  );
};
const createTableRow = ({
  providerIcon,
  provider,
  serviceIcon,
  service,
  serviceTooltip,
  price,
  unit,
  unitTooltip,
}: {
  providerIcon: ReactNode;
  provider: string;
  serviceIcon: IconDefinition;
  service: string;
  serviceTooltip: string;
  price: string;
  unit: string;
  unitTooltip: string;
}) => {
  return [
    <TableCell
      key="provider"
      sx={{
        pt: 1.5,
        pb: 1,
      }}
    >
      <Box display="flex" gap={1.25} alignItems="center">
        <Box sx={{ lineHeight: 1, position: "relative", bottom: 1 }}>
          {providerIcon}
        </Box>
        <Typography
          variant="bpBodyCopy"
          sx={{
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {provider}
        </Typography>
      </Box>
    </TableCell>,
    <TableCell
      key="service"
      sx={{
        display: "flex",
        alignItems: "center",
        pt: 1.5,
        pb: 1,
      }}
    >
      <FontAwesomeIcon
        icon={serviceIcon}
        sx={{
          fontSize: 15,
          fill: ({ palette }) => palette.purple[40],
          mr: 1.25,
        }}
      />
      <Tooltip title={serviceTooltip} placement="top" followCursor>
        <Box display="flex">
          <CustomLink
            variant="bpBodyCopy"
            sx={{
              display: "inline-flex",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {service}
          </CustomLink>
        </Box>
      </Tooltip>
    </TableCell>,
    <TableCell
      key="price"
      sx={{
        pt: 1.5,
        pb: 0.75,
      }}
    >
      <Typography
        variant="bpBodyCopy"
        sx={{
          color: ({ palette }) => palette.gray[70],
          lineHeight: 1.2,
        }}
      >
        {price}
      </Typography>
    </TableCell>,
    <TableCell
      key="unit"
      sx={{
        pt: 1.5,
        pb: 1,
      }}
    >
      <Box display="flex" gap={0.75} alignItems="center">
        <Typography
          variant="bpBodyCopy"
          sx={{
            color: ({ palette }) => palette.gray[70],
            lineHeight: 1.2,
          }}
        >
          {unit}
        </Typography>

        <Tooltip title={unitTooltip} placement="top">
          <Box sx={{ lineHeight: 1 }}>
            <CircleInfoRegularIcon
              sx={{
                cursor: "pointer",
                fontSize: 13,
                fill: ({ palette }) => palette.gray[50],
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </TableCell>,
  ];
};

export const PaidAddonsSection: FunctionComponent = () => {
  return (
    <Box sx={{ pt: 11.15, position: "relative" }}>
      <Box sx={{ position: "absolute", width: 1, top: 0 }}>
        <Image layout="responsive" src={circleBackground} />
      </Box>

      <Container
        sx={{
          position: "relative",
          mb: { xs: 8, md: 12.5 },
          maxWidth: { md: 800, lg: 1200 },
          px: "6.5%",
        }}
      >
        <Typography
          variant="bpHeading4"
          sx={{ textTransform: "uppercase", mb: 2.5, lineHeight: 1.4 }}
        >
          <strong>Paid</strong>{" "}
          <Box
            component="span"
            sx={{ color: ({ palette }) => palette.gray[60] }}
          >
            ADD-ONS
          </Box>
        </Typography>

        <Grid
          container
          sx={{
            display: "grid",
            gridTemplateAreas: {
              xs: `'usage' 'dev' 'support'`,
              lg: `'usage dev'
            'usage support'`,
            },
            gridGap: 20,
          }}
        >
          <Section sectionName="usage" fullWidth>
            <Stack flexDirection="row" alignItems="center" mb={2.25}>
              <GradientFontAwesomeIcon
                icon={faCode}
                sx={{ mr: 1.5, fontSize: 32 }}
                light
              />

              <Typography
                variant="bpHeading3"
                sx={{
                  lineHeight: 1.4,
                  color: ({ palette }) => palette.gray[90],
                }}
              >
                Additional API Usage
              </Typography>
            </Stack>

            <Stack gap={2.25}>
              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>
                  API usage beyond your included allowance will be billed in
                  line with the below.
                </strong>{" "}
                Hobby and Pro users can prevent overage charges by setting a{" "}
                <CustomLink href="/account/billing">spend cap</CustomLink> from
                the account billing page.
              </Typography>

              <Box sx={{ overflowX: "auto" }}>
                <Table
                  header={API_USAGE_HEADER.map((title) => (
                    <UsageTableHeaderCell key={title}>
                      {title}
                    </UsageTableHeaderCell>
                  ))}
                  rows={API_USAGE_ROWS.map((row) => createTableRow(row))}
                />
              </Box>

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>
                  We strive to keep these prices in line with the ordinary cost
                  of these services.
                </strong>{" "}
                If you believe any of these prices are out of sync with the
                costs charged by the underlying provider,{" "}
                <CustomLink href="/contact">please let us know</CustomLink>. A
                Platform Service Fee of <i>25%</i> for Hobby users, and{" "}
                <i>20%</i> for Pro users, is applied to Additional API Usage
                calls to cover costs.
              </Typography>

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>Want to list an endpoint?</strong>{" "}
                <CustomLink
                  href="/docs/services"
                  sx={{ display: "inline-flex", alignItems: "center" }}
                >
                  Find out more
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    sx={{ fontSize: 14 }}
                  />
                </CustomLink>
              </Typography>
            </Stack>
          </Section>

          <Section sectionName="dev">
            <Stack flexDirection="row" alignItems="center" mb={2.25}>
              <GradientFontAwesomeIcon
                icon={faHammer}
                sx={{ mr: 1.5, fontSize: 32 }}
                light
              />

              <Typography
                variant="bpHeading3"
                sx={{
                  lineHeight: 1.4,
                  color: ({ palette }) => palette.gray[90],
                }}
              >
                Dev Services
              </Typography>
            </Stack>

            <Stack gap={2.25}>
              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>
                  Anybody can suggest amendments to the Þ specification.
                </strong>{" "}
                The protocol is openly debated and governed, and you don’t need
                to hire us (in fact, you can’t!) in order to change the spec.
              </Typography>

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>Similarly, anyone can build a Þ block.</strong> However,
                if you’d like a block built for you, or are looking to partner
                on a particularly complex block, we provide support or can
                connect you with a community developer.
              </Typography>

              <Box>
                <CustomLinkButton
                  href="/contact"
                  endIcon={<FontAwesomeIcon icon={faEnvelope} />}
                >
                  Contact us
                </CustomLinkButton>
              </Box>
            </Stack>
          </Section>

          <Section sectionName="support">
            <Stack flexDirection="row" alignItems="center" mb={2.25}>
              <GradientFontAwesomeIcon
                icon={faSlack}
                sx={{ mr: 1.5, fontSize: 32 }}
                light
              />

              <Typography
                variant="bpHeading3"
                sx={{
                  lineHeight: 1.4,
                  color: ({ palette }) => palette.gray[90],
                }}
              >
                1:1 Support
              </Typography>
            </Stack>

            <Stack gap={2.25}>
              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>
                  We offer dedicated 1:1 premium support with guaranteed SLAs
                  via email and Slack.
                </strong>
              </Typography>

              <List sx={{ marginLeft: 3, listStyle: "disc" }}>
                <Typography
                  variant="bpBodyCopy"
                  sx={{ lineHeight: 1.4 }}
                  component="li"
                >
                  For embedders integrating the Block Protocol into their
                  application or framework
                </Typography>
                <Typography
                  variant="bpBodyCopy"
                  sx={{ lineHeight: 1.4 }}
                  component="li"
                >
                  For block developers building complex applications
                </Typography>
                <Typography
                  variant="bpBodyCopy"
                  sx={{ lineHeight: 1.4 }}
                  component="li"
                >
                  For API providers listing on the Hub
                </Typography>
                <Typography
                  variant="bpBodyCopy"
                  sx={{ lineHeight: 1.4 }}
                  component="li"
                >
                  For users of blocks who are heavily dependent on them for work
                </Typography>
              </List>

              <Box>
                <CustomLinkButton
                  href="/contact"
                  endIcon={<FontAwesomeIcon icon={faEnvelope} />}
                >
                  Contact us
                </CustomLinkButton>
              </Box>
            </Stack>
          </Section>
        </Grid>
      </Container>
    </Box>
  );
};
