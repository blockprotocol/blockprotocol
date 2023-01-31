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

import { BlockProtocolLogoIcon, FontAwesomeIcon } from "./icons";
import { ArrowUpRightIcon } from "./icons/arrow-up-right-icon";
import { DiscordIcon } from "./icons/discord-icon";
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
      href: "/docs/spec",
    },
    // Uncomment when we have the pricing page
    // {
    //   name: "Pricing",
    //   href: "/pricing",
    // },
    {
      name: "Contact Us",
      href: "/contact",
    },
  ],
};

const DISCOVER_NAVIGATION_LINKS: NavigationSection = {
  title: "Discover",
  links: [
    {
      name: "Open-source blocks",
      href: "/hub",
    },
    {
      name: "Semantic types",
      href: "/hub",
    },
    {
      name: "API endpoints",
      href: "/hub",
    },
  ],
};

const PUBLISH_NAVIGATION_LINKS: NavigationSection = {
  title: "Publish...",
  links: [
    {
      name: "a block",
      href: "/docs/developing-blocks#publish",
      arrow: true,
    },
    // Uncomment when we have the pages to link this to
    // {
    //   name: "a type",
    //   href: "/",
    //   arrow: true,
    // },
    // {
    //   name: "an endpoint",
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
        color: "#C5D1DB",
      }}
    >
      {title}
    </Typography>
    {links.map(({ href, name, arrow }) => (
      <Typography
        component="p"
        variant="bpSmallCopy"
        key={href}
        sx={{
          lineHeight: "18px",
          color: "#9EACBA",
          fill: "#64778C",
          "> a": {
            borderBottomWidth: 0,
            ":hover": {
              color: "#F2F5FA",
              fill: "#9EACBA",
            },
            ":focus-visible": {
              outlineColor: "#9EACBA",
            },
          },
        }}
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
    href: "https://twitter.com/blockprotocol",
  },
  {
    name: "Discord",
    icon: <DiscordIcon />,
    href: "/discord",
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
          sx={{
            padding: 1.5,
            ...(index === 0 && { paddingLeft: 0 }),
            color: "#9EACBA",
            ":hover": {
              svg: {
                color: "#F2F5FA",
              },
            },
            ":focus-visible": {
              outlineColor: "#9EACBA",
            },
            svg: {
              fontSize: 20,
              transition: (theme) =>
                theme.transitions.create("color", { duration: 150 }),
              color: "inherit",
            },
          }}
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
        backgroundColor: "#9EACBA",
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
              iconColor="#D8DFE5"
              logoColor="#F2F5FA"
            />
            {lg ? (
              <>
                <Typography
                  component="p"
                  variant="bpMicroCopy"
                  sx={{
                    marginTop: 2,
                    lineHeight: "20px",
                    color: "#9EACBA",
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
          {/* Uncomment when we have the pages to link this to */}
          {/* <Grid item xs={12}>
            {[
              { title: "Terms", href: "/terms" },
              { title: "Privacy", href: "/privacy" },
            ].map(({ title, href }, index) => (
              <Link
                key={title}
                variant="bpSmallCaps"
                href={href}
                sx={{
                  fontSize: 12,
                  lineHeight: 1,
                  padding: 1.25,
                  color: "#9EACBA",
                  transition: ({ transitions }) =>
                    transitions.create("color", { duration: 150 }),
                  ...(index === 0 && { paddingLeft: 0 }),
                  ":hover": {
                    color: "#F2F5FA",
                  },
                }}
              >
                {title}
              </Link>
            ))}
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};
