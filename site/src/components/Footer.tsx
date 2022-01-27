import { FC, ReactNode } from "react";
import {
  Icon,
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  BoxProps,
} from "@mui/material";
import { Link } from "./Link";
import { BlockProtocolLogoIcon } from "./SvgIcon/BlockProtocolLogoIcon";
import { HASHLogoIcon } from "./SvgIcon/HASHLogoIcon";
import { LinkButton } from "./LinkButton";

const FOOTER_NAVIGATION_LINKS: { href: string; name: string }[] = [
  {
    name: "Block Hub",
    href: "/hub",
  },
  {
    name: "Documentation",
    href: "/docs",
  },
  {
    name: "Specification",
    href: "/spec",
  },
  {
    name: "Publish a Block",
    href: "/docs/publishing-blocks",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

const FooterNavigationLinks = FOOTER_NAVIGATION_LINKS.map(({ href, name }) => (
  <Typography
    component="p"
    variant="bpSmallCopy"
    sx={{
      color: ({ palette }) => palette.gray[40],
      "&:first-of-type": {
        marginTop: {
          xs: 1.5,
          sm: 0,
        },
      },
      "&:not(:first-of-type)": {
        marginTop: 1.5,
      },
    }}
    key={href}
  >
    <Link
      href={href}
      sx={(theme) => ({
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
      })}
    >
      {name}
    </Link>
  </Typography>
));

const SOCIALS: { name: string; icon: ReactNode; href: string }[] = [
  {
    name: "Twitter",
    icon: <Icon className="fab fa-twitter" />,
    href: "https://twitter.com/blockprotocol",
  },
  {
    name: "Discord",
    icon: <Icon className="fab fa-discord" />,
    href: "/discord",
  },
  {
    name: "GitHub",
    icon: <Icon className="fab fa-github" />,
    href: "https://github.com/blockprotocol",
  },
];

const Socials = (
  <Box
    mt={3}
    display="flex"
    flexDirection="row"
    alignItems="center"
    flexWrap="wrap"
  >
    <Box marginBottom={2.5} flexShrink={0}>
      {SOCIALS.map(({ href, icon }) => (
        <Link
          href={href}
          key={href}
          sx={{
            marginRight: 2.5,
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
        marginBottom: 2.5,
        backgroundColor: (theme) => theme.palette.gray[70],
        color: (theme) => theme.palette.gray[20],
        ":focus-visible:after": {
          borderColor: (theme) => theme.palette.gray[70],
        },
      }}
      startIcon={<Icon className="fa fa-star" />}
    >
      Star us on Github
    </LinkButton>
  </Box>
);

type FooterProps = {} & BoxProps;

export const Footer: FC<FooterProps> = ({ ...boxProps }) => {
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      {...boxProps}
      sx={{
        backgroundColor: ({ palette }) => palette.gray[80],
        ...boxProps.sx,
      }}
    >
      <Container
        sx={{
          py: {
            sm: 8,
            xs: 4,
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={4}>
            <BlockProtocolLogoIcon
              sx={{
                display: "block",
                color: theme.palette.gray[20],
              }}
            />
            {md ? (
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
                  The open-source specification and registry
                  <br />
                  for data-driven, interactive blocks
                </Typography>
                {Socials}
              </>
            ) : null}
          </Grid>
          <Grid item xs={12} md={3} lg={4}>
            {FooterNavigationLinks}
            {md ? null : Socials}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            alignItems="flex-end"
            sx={{
              justifyContent: {
                xs: "flex-start",
                md: "flex-end",
              },
            }}
          >
            <Typography
              component="p"
              sx={{
                color: ({ palette }) => palette.gray[50],
                fontWeight: 400,
                display: "flex",
              }}
              variant="bpSmallCopy"
            >
              Supported by{" "}
              <Box
                component="a"
                href="https://hash.ai"
                sx={{
                  marginLeft: 1,
                  ":hover": {
                    color: ({ palette }) => palette.gray[30],
                  },
                  ":active": {
                    color: ({ palette }) => palette.common.white,
                  },
                  ":focus-visible": {
                    borderColor: "transparent",
                    outline: ({ palette }) => `1px solid ${palette.gray[50]}`,
                  },
                }}
              >
                <HASHLogoIcon
                  sx={{
                    transition: theme.transitions.create(
                      ["color", "borderColor"],
                      {
                        duration: 150,
                      },
                    ),
                  }}
                />
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
