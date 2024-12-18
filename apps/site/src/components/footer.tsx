import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  BoxProps,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

import { isBillingFeatureFlagEnabled } from "../lib/config";
import { BlockProtocolLogoIcon, FontAwesomeIcon } from "./icons";
import { ArrowUpRightIcon } from "./icons/arrow-up-right-icon";
import { Link } from "./link";
import { LinkButton } from "./link-button";

interface NavigationSection {
  title: string;
  links: NavigationLink[];
}
interface NavigationLink {
  href: string;
  name: string;
  arrow?: boolean;
}

const LEARN_MORE_NAVIGATION_LINKS: NavigationSection = {
  title: "Learn more",
  links: [
    {
      name: "Documentation",
      href: "/docs",
    },
    {
      name: "Specification",
      href: "/spec",
    },
    ...(isBillingFeatureFlagEnabled
      ? [
          {
            name: "Pricing",
            href: "/pricing",
          },
        ]
      : []),
    {
      name: "Contact Us",
      href: "/contact",
    },
    {
      name: "About Us",
      href: "/about",
    },
  ],
};

const DISCOVER_NAVIGATION_LINKS: NavigationSection = {
  title: "Discover",
  links: [
    {
      name: "Open-source blocks",
      href: "/hub?type=blocks",
    },
    {
      name: "Semantic types",
      href: "/hub?type=types",
    },
    {
      name: "API services",
      href: "/hub?type=services",
    },
  ],
};

const PUBLISH_NAVIGATION_LINKS: NavigationSection = {
  title: "Publish...",
  links: [
    {
      name: "a block",
      href: "/docs/blocks/develop#publish",
      arrow: true,
    },
    // Uncomment when we have the pages to link this to
    // Don't forget to uncomment in tests aswell
    // {
    //   name: "a type",
    //   href: "/",
    //   arrow: true,
    // },
    // {
    //   name: "a service",
    //   href: "/",
    //   arrow: true,
    // },
  ],
};

const FooterNavigationLinks: FunctionComponent<{
  section: NavigationSection;
}> = ({ section: { title, links } }) => (
  <Stack gap={2}>
    <Typography
      component="p"
      variant="bpSmallCopy"
      sx={{
        lineHeight: "18px",
        fontWeight: 700,
        color: ({ palette }) => palette.bpGray[40],
      }}
    >
      {title}
    </Typography>
    {links.map(({ href, name, arrow }) => (
      <Typography
        component="p"
        variant="bpSmallCopy"
        key={name}
        sx={({ palette }) => ({
          lineHeight: "18px",
          color: palette.bpGray[50],
          fill: palette.bpGray[60],
          "> a": {
            borderBottomWidth: 0,
            ":hover": {
              color: palette.bpGray[20],
              fill: palette.bpGray[50],
            },
            ":focus-visible": {
              outlineColor: palette.bpGray[50],
            },
          },
        })}
      >
        <Link href={href} display="flex" alignItems="center">
          {name}
          {arrow ? (
            <ArrowUpRightIcon
              sx={{
                fontSize: 15,
                ml: 1,
                fill: "inherit",
              }}
            />
          ) : null}
        </Link>
      </Typography>
    ))}
  </Stack>
);

const SOCIALS: { name: string; icon: ReactNode; href: string }[] = [
  {
    name: "GitHub",
    icon: <FontAwesomeIcon icon={faGithub} />,
    href: "https://github.com/blockprotocol/blockprotocol",
  },
  {
    name: "Twitter",
    icon: <FontAwesomeIcon icon={faTwitter} />,
    href: "https://x.com/blockprotocol",
  },
];

const Socials = (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    flexWrap="wrap"
    sx={{ gridGap: 12 }}
    data-testid="footer-social-links"
  >
    <Box flexShrink={0}>
      {SOCIALS.map(({ href, icon }, index) => (
        <Link
          href={href}
          key={href}
          sx={({ palette, transitions }) => ({
            padding: 1.5,
            ...(index === 0 && { paddingLeft: 0 }),
            color: palette.bpGray[50],
            ":hover": {
              svg: {
                color: palette.bpGray[20],
              },
            },
            ":focus-visible": {
              outlineColor: palette.bpGray[50],
            },
            svg: {
              fontSize: 20,
              transition: transitions.create("color", { duration: 150 }),
              color: "inherit",
            },
          })}
        >
          {icon}
        </Link>
      ))}
    </Box>
    <LinkButton
      href="https://github.com/blockprotocol/blockprotocol"
      variant="primary"
      color="gray"
      size="small"
      sx={{
        flexShrink: 0,
        backgroundColor: ({ palette }) => palette.bpGray[50],
      }}
      startIcon={<FontAwesomeIcon icon={faStar} />}
    >
      Star us on GitHub
    </LinkButton>
  </Box>
);

type FooterProps = {} & BoxProps;

export const Footer: FunctionComponent<FooterProps> = ({
  sx = [],
  ...boxProps
}) => {
  const theme = useTheme();

  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      component="footer"
      {...boxProps}
      sx={[
        {
          backgroundColor: ({ palette }) => palette.gray[90],
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container
        sx={{
          py: {
            sm: 9,
            xs: 4,
          },
        }}
      >
        <Grid
          container
          sx={{
            columnGap: 2,
            rowGap: 3,
            margin: "0 auto",
            mb: 2.5,
          }}
        >
          <Grid item xs={12} md={12} lg={4}>
            <BlockProtocolLogoIcon
              sx={{
                display: "block",
                color: theme.palette.gray[20],
              }}
              iconColor={theme.palette.bpGray[30]}
              logoColor={theme.palette.bpGray[20]}
            />
            {lg ? (
              <>
                <Typography
                  component="p"
                  variant="bpMicroCopy"
                  sx={{
                    marginTop: 2,
                    lineHeight: "20px",
                    color: ({ palette }) => palette.bpGray[50],
                    fontSize: 13,
                  }}
                >
                  The open-source specification and hub
                  <br />
                  for data-driven, interactive blocks
                </Typography>
                <Box mt={2.5}>{Socials}</Box>
              </>
            ) : null}
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              display: "flex",
              rowGap: 5,
              columnGap: 8,
              flexWrap: "wrap",
            }}
          >
            <FooterNavigationLinks section={LEARN_MORE_NAVIGATION_LINKS} />
            <FooterNavigationLinks section={DISCOVER_NAVIGATION_LINKS} />
            <FooterNavigationLinks section={PUBLISH_NAVIGATION_LINKS} />
          </Grid>
          {lg ? null : (
            <Grid item xs={12}>
              {Socials}
            </Grid>
          )}

          <Grid item xs={12}>
            {[
              { title: "Terms", href: "/legal/terms" },
              { title: "Privacy", href: "/legal/privacy" },
            ].map(({ title, href }, index) => (
              <Link
                key={title}
                variant="bpSmallCaps"
                href={href}
                sx={({ palette, transitions }) => ({
                  fontSize: 12,
                  lineHeight: 1,
                  padding: 1.25,
                  color: palette.bpGray[50],
                  transition: transitions.create("color", { duration: 150 }),
                  ...(index === 0 && { paddingLeft: 0 }),
                  ":hover": {
                    color: palette.bpGray[20],
                  },
                })}
              >
                {title}
              </Link>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
