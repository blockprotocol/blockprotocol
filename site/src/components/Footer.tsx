import { FC, ReactNode } from "react";
import Link from "next/link";
import {
  Icon,
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { BlockProtocolLogoIcon } from "./SvgIcon/BlockProtocolLogoIcon";
import { HASHLogoIcon } from "./SvgIcon/HASHLogoIcon";

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
    href: "/publish",
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
    sx={(theme) => ({
      transition: theme.transitions.create("color", { duration: 150 }),
      color: theme.palette.gray[40],
      ":hover": {
        color: theme.palette.gray[20],
      },
      ":active": {
        color: theme.palette.common.white,
      },
      "&:first-child": {
        marginTop: {
          xs: 1.5,
          sm: 0,
        },
      },
      "&:not(:first-child)": {
        marginTop: 1.5,
      },
    })}
    key={href}
  >
    <Link href={href}>
      <a>{name}</a>
    </Link>
  </Typography>
));

const SOCIALS: { name: string; icon: ReactNode; href: string }[] = [
  {
    name: "GitHub",
    icon: <Icon className="fab fa-github" />,
    href: "https://github.com/blockprotocol",
  },
  {
    name: "Twitter",
    icon: <Icon className="fab fa-twitter" />,
    href: "https://twitter.com/blockprotocol",
  },
  {
    name: "Discord",
    icon: <Icon className="fab fa-discord" />,
    href: "https://discord.gg/PefPteFe5j",
  },
];

const Socials = (
  <Box mt={3} display="flex">
    {SOCIALS.map(({ href, icon }) => (
      <Link href={href} key={href} passHref>
        <Box
          mr={2.5}
          sx={{
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
            svg: {
              transition: (theme) =>
                theme.transitions.create("color", { duration: 150 }),
              color: (theme) => theme.palette.gray[50],
            },
          }}
          component="a"
        >
          {icon}
        </Box>
      </Link>
    ))}
  </Box>
);

type FooterProps = {};

export const Footer: FC<FooterProps> = () => {
  const theme = useTheme();

  const md = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        backgroundColor: ({ palette }) => palette.gray[80],
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
              }}
              variant="bpSmallCopy"
            >
              Supported by{" "}
              <Box
                component="a"
                href="https://hash.ai"
                sx={{
                  marginLeft: 0.35,
                  ":hover": {
                    color: ({ palette }) => palette.gray[30],
                  },
                  ":active": {
                    color: ({ palette }) => palette.common.white,
                  },
                }}
              >
                <HASHLogoIcon
                  sx={{
                    transition: theme.transitions.create("color", {
                      duration: 150,
                    }),
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
