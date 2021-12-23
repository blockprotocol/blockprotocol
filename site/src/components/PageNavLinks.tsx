import { VFC } from "react";
import { Typography, Box, Icon, BoxProps, styled } from "@mui/material";
import { Link } from "./Link";
import { SiteMapPage } from "../lib/sitemap";

const NavArrowIcon = styled(Icon)(({ theme }) => ({
  color: theme.palette.purple[300],
  fontSize: 15,
  marginTop: theme.spacing(0.8),
  position: "relative",
  left: 0,
  transition: theme.transitions.create("left"),
}));

type PageNavLinksProps = {
  prevPage?: SiteMapPage;
  nextPage?: SiteMapPage;
} & BoxProps;

export const PageNavLinks: VFC<PageNavLinksProps> = ({
  prevPage,
  nextPage,
  ...boxProps
}) => {
  return (
    <Box display="flex" justifyContent="space-between" {...boxProps}>
      <Box>
        {prevPage && (
          <Box display="flex" alignItems="flex-end">
            <Box>
              <Typography
                sx={(theme) => ({ color: theme.palette.gray[60] })}
                component="p"
                variant="bpSmallCopy"
              >
                Previous
              </Typography>
              <Box
                display="flex"
                sx={(theme) => ({
                  marginLeft: {
                    xs: 0,
                    md: "-31px",
                  },
                  ":hover svg": {
                    left: `-${theme.spacing(1)}`,
                  },
                })}
              >
                <NavArrowIcon
                  sx={{
                    marginRight: 2,
                    display: {
                      xs: "none",
                      md: "inherit",
                    },
                  }}
                  className="fas fa-arrow-left"
                />
                <Link
                  sx={(theme) => ({
                    maxWidth: {
                      xs: 150,
                      sm: 200,
                    },
                    ":hover": {
                      color: theme.palette.purple[800],
                    },
                  })}
                  href={prevPage.href}
                >
                  {prevPage.title}
                </Link>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box>
        {nextPage && (
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography
              sx={(theme) => ({ color: theme.palette.gray[60] })}
              component="p"
              variant="bpSmallCopy"
            >
              Next
            </Typography>
            <Box
              display="flex"
              sx={(theme) => ({
                marginRight: {
                  xs: 0,
                  md: "-31px",
                },
                ":hover svg": {
                  left: theme.spacing(1),
                },
              })}
            >
              <Link
                sx={(theme) => ({
                  textAlign: "right",
                  maxWidth: {
                    xs: 150,
                    sm: 200,
                  },
                  ":hover": {
                    color: theme.palette.purple[800],
                  },
                })}
                href={nextPage.href}
              >
                {nextPage.title}
              </Link>
              <NavArrowIcon
                sx={{
                  marginLeft: 2,
                  display: {
                    xs: "none",
                    md: "inherit",
                  },
                }}
                className="fas fa-arrow-right"
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
