import { faSlack } from "@fortawesome/free-brands-svg-icons";
import {
  faChevronRight,
  faCode,
  faImage,
  faMessage,
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
import { FontAwesomeIcon } from "../../icons";
import { AbstractAiIcon } from "../../icons/abstract-ai-icon";
import { CircleInfoRegularIcon } from "../../icons/circle-info-regular";
import { MapboxLogoIcon } from "../../icons/mapbox-logo-icon";
import { faEnvelope } from "../../icons/pro/fa-envelope";
import { faHammer } from "../../icons/pro/fa-hammer";
import { faLocationCrosshairs } from "../../icons/pro/fa-location";
import { faLocationArrow } from "../../icons/pro/fa-location-arrow";
import { faLocationPin } from "../../icons/pro/fa-location-pin";
import { faMap } from "../../icons/pro/fa-map";
import { faText } from "../../icons/pro/fa-text";
import { Link } from "../../link";
import { Table } from "../../table";
import { CustomLinkButton } from "./custom-link-button";
import { GradientFontAwesomeIcon } from "./gradient-fontawesome-icon";

const Section: FunctionComponent<{ sectionName: string } & BoxProps> = ({
  sectionName,
  children,
}) => {
  return (
    <Grid
      item
      sx={({ breakpoints }) => ({
        gridArea: sectionName,
        [breakpoints.down("lg")]: {
          display: "flex",
          justifyContent: "center",
        },
      })}
    >
      <Stack
        sx={({ palette }) => ({
          background: `${palette.common.white}80`,
          border: `1px solid ${palette.gray[20]}`,
          backdropFilter: "blur(7.5px)",
          padding: 4.25,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
        })}
      >
        <Box sx={{ paddingX: 1.5 }}>{children}</Box>
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
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faImage,
    service: "DALL-E",
    price: "$0.020",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/image",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faText,
    service: "GPT-3 Davinci",
    price: "$0.0200",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faText,
    service: "GPT-3 Curie",
    price: "$0.0020",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faText,
    service: "GPT-3 Babbage",
    price: "$0.0005",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <AbstractAiIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "OpenAI",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faText,
    service: "GPT-3 Ada",
    price: "$0.0004",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/1k tokens",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faLocationPin,
    service: "Address Autofill",
    price: "$0.0125",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faLocationCrosshairs,
    service: "Isochrone",
    price: "$0.002",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faLocationArrow,
    service: "Directions",
    price: "$0.002",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
    unit: "/request",
  },
  {
    providerIcon: (
      <MapboxLogoIcon
        sx={{
          fontSize: 16,
          fill: ({ palette }) => palette.gray[50],
        }}
      />
    ),
    provider: "Mapbox",
    serviceTooltip:
      "DALL-E is a generative AI that creates realistic images and art from natural language descriptions",
    serviceIcon: faMap,
    service: "Temporary Geocoding",
    price: "$0.00075",
    unitTooltip:
      "Corresponds to a single point-to-point lookup between two locations",
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
      <Box display="flex" gap={1.25}>
        <Box>{providerIcon}</Box>
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
        pt: 1.5,
        pb: 1,
      }}
    >
      <Tooltip title={serviceTooltip} placement="top">
        <Link
          href=""
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <FontAwesomeIcon
            icon={serviceIcon}
            sx={{ fontSize: 15, fill: ({ palette }) => palette.purple[40] }}
          />
          <Typography
            variant="bpBodyCopy"
            sx={{
              color: ({ palette }) => palette.purple[70],
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {service}
          </Typography>
        </Link>
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
          <Box>
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
          mb: { xs: 6, md: 10 },
          maxWidth: { md: 800, lg: 1200 },
          px: "6.5%",
        }}
      >
        <Typography
          variant="bpHeading4"
          sx={{ textTransform: "uppercase", mb: 2, lineHeight: 1.4 }}
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
          <Section sectionName="usage">
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
                <Box
                  component="strong"
                  sx={{ color: ({ palette }) => palette.purple[70] }}
                >
                  spend cap
                </Box>{" "}
                from the account billing page.
              </Typography>

              <Table
                header={API_USAGE_HEADER.map((title) => (
                  <UsageTableHeaderCell key={title}>
                    {title}
                  </UsageTableHeaderCell>
                ))}
                rows={API_USAGE_ROWS.map((row) => createTableRow(row))}
              />

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>
                  We strive to keep these prices in line with the ordinary cost
                  of these services.
                </strong>{" "}
                If you believe any of these prices are out of sync with the
                costs charged by the underlying provider,{" "}
                <Box
                  component="strong"
                  sx={{ color: ({ palette }) => palette.purple[70] }}
                >
                  please let us know
                </Box>
                . A Platform Service Fee of <i>25%</i> for Hobby users, and{" "}
                <i>20%</i> for Pro users, is applied to Additional API Usage
                calls to cover costs.
              </Typography>

              <Typography variant="bpBodyCopy" sx={{ lineHeight: 1.4 }}>
                <strong>Want to list an endpoint?</strong>{" "}
                <Box
                  component="strong"
                  sx={{ color: ({ palette }) => palette.purple[70] }}
                >
                  Find out more
                  <FontAwesomeIcon icon={faChevronRight} />
                </Box>
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

              <CustomLinkButton
                href="/contact"
                endIcon={<FontAwesomeIcon icon={faEnvelope} />}
              >
                Contact us
              </CustomLinkButton>
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

              <CustomLinkButton
                href="/contact"
                endIcon={<FontAwesomeIcon icon={faEnvelope} />}
              >
                Contact us
              </CustomLinkButton>
            </Stack>
          </Section>
        </Grid>
      </Container>
    </Box>
  );
};
