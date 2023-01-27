import {
  faDiscord,
  faGithub,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
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
  title: "Publish",
  links: [
    {
      name: "a block",
      href: "/docs/developing-blocks#publish",
      arrow: true,
    },
    // {
    //   name: "Semantic types",
    //   href: "/hub",
    //   arrow: true,
    // },
    // {
    //   name: "API endpoints",
    //   href: "/hub",
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
        sx={(theme) => ({
          lineHeight: "18px",
          color: "#C5D1DB",
          "> a": {
            borderBottomWidth: 0,
            transition: theme.transitions.create("color", { duration: 150 }),
            ":hover": {
              color: theme.palette.gray[20],
            },
            ":active": {
              color: theme.palette.common.white,
            },
            ":focus-visible": {
              outlineColor: theme.palette.gray[40],
            },
          },
        })}
      >
        <Link href={href} display="flex">
          {name}
          {arrow ? (
            <ArrowUpRightIcon
              sx={{ fontSize: 15, ml: 1, alignSelf: "flex-start" }}
            />
          ) : null}
        </Link>
      </Typography>
    ))}
  </Stack>
);

const SOCIALS: { name: string; icon: ReactNode; href: string }[] = [
  {
    name: "Twitter",
    icon: <FontAwesomeIcon icon={faTwitter} />,
    href: "https://twitter.com/blockprotocol",
  },
  {
    name: "Discord",
    icon: <FontAwesomeIcon icon={faDiscord} />,
    href: "/discord",
  },
  {
    name: "GitHub",
    icon: <FontAwesomeIcon icon={faGithub} />,
    href: "https://github.com/blockprotocol/blockprotocol",
  },
];

const Socials = (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    flexWrap="wrap"
    sx={{ gridGap: "1rem" }}
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
            color: (theme) => theme.palette.gray[50],
            ":hover": {
              svg: {
                color: (theme) => theme.palette.gray[30],
              },
            },
            ":active": {
              svg: {
                color: (theme) => theme.palette.common.white,
              },
            },
            ":focus-visible": {
              outlineColor: (theme) => theme.palette.gray[50],
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
            />
            {lg ? (
              <>
                <Typography
                  component="p"
                  variant="bpMicroCopy"
                  sx={{
                    marginTop: 2,
                    lineHeight: "1.25rem",
                    color: ({ palette }) => palette.gray[50],
                  }}
                >
                  The open-source specification and hub
                  <br />
                  for data-driven, interactive blocks
                </Typography>
                <Box mt={3}>{Socials}</Box>
              </>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={3.5} md={3} lg={2}>
            <FooterNavigationLinks section={LEARN_MORE_NAVIGATION_LINKS} />
          </Grid>
          <Grid item xs={12} sm={3.5} md={3} lg={2}>
            <FooterNavigationLinks section={DISCOVER_NAVIGATION_LINKS} />
          </Grid>
          <Grid item xs={12} sm={3.5} md={3} lg={2}>
            <FooterNavigationLinks section={PUBLISH_NAVIGATION_LINKS} />
          </Grid>
          <Grid item xs={12}>
            {lg ? null : Socials}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
